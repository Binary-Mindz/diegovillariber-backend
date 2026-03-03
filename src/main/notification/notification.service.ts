import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';

import {
  FirestoreNotification,
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from './notification.types';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { UpdateNotificationPrefsDto } from './dto/update-prefs.dto';

@Injectable()
export class NotificationsService {
  private db: FirebaseFirestore.Firestore;
  private messaging: admin.messaging.Messaging;

  constructor(@Inject('FIREBASE_ADMIN') private readonly app: admin.app.App) {
    this.db = this.app.firestore();
    this.messaging = this.app.messaging();
  }

  private notifCol(userId: string) {
    return this.db.collection('users').doc(userId).collection('notifications');
  }
  private tokenCol(userId: string) {
    return this.db.collection('users').doc(userId).collection('fcmTokens');
  }
  private prefsDoc(userId: string) {
    return this.db.collection('users').doc(userId).collection('notificationPrefs').doc('prefs');
  }

  // --------------------
  // Tokens
  // --------------------
  async registerFcmToken(userId: string, dto: RegisterFcmTokenDto) {
    const doc = this.tokenCol(userId).doc(dto.token);
    await doc.set(
      {
        token: dto.token,
        deviceType: dto.deviceType,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return { saved: true };
  }

  async unregisterFcmToken(userId: string, token: string) {
    await this.tokenCol(userId).doc(token).delete();
    return { deleted: true };
  }

  // --------------------
  // Prefs
  // --------------------
  async getPrefs(userId: string) {
    const snap = await this.prefsDoc(userId).get();
    if (!snap.exists) {
      return {
        inAppEnabled: true,
        pushEnabled: true,
        emailEnabled: false,
        mutedTypes: [],
        quietStart: null,
        quietEnd: null,
        timezone: 'Asia/Dhaka',
      };
    }
    return snap.data();
  }

  async updatePrefs(userId: string, dto: UpdateNotificationPrefsDto) {
    await this.prefsDoc(userId).set(
      {
        ...dto,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return { updated: true };
  }

  // --------------------
  // Create notification
  // --------------------
  async createInApp(n: Omit<FirestoreNotification, 'createdAt' | 'updatedAt' | 'readAt'>) {
    const ref = this.notifCol(n.userId).doc();

    const data: FirestoreNotification = {
      ...n,
      channel: n.channel ?? NotificationChannel.IN_APP,
      status: n.status ?? NotificationStatus.UNREAD,
      readAt: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await ref.set(data, { merge: true });
    return { id: ref.id, ...data };
  }

  // Push sender + invalid token cleanup
  private async sendPushToUser(userId: string, title: string, body: string, data?: Record<string, string>) {
    const prefs = (await this.getPrefs(userId)) as any;
    if (prefs?.pushEnabled === false) return { sent: 0, reason: 'push disabled' };

    const tokenSnap = await this.tokenCol(userId).get();
    const tokens = tokenSnap.docs.map((d) => (d.data() as any).token).filter(Boolean);

    if (!tokens.length) return { sent: 0, reason: 'no tokens' };

    const res = await this.messaging.sendEachForMulticast({
      tokens,
      notification: { title, body },
      data: data ?? {},
    });

    // cleanup invalid tokens
    const invalid: string[] = [];
    res.responses.forEach((r, i) => {
      if (!r.success) {
        const code = r.error?.code ?? '';
        if (code.includes('registration-token-not-registered') || code.includes('invalid-argument')) {
          invalid.push(tokens[i]);
        }
      }
    });

    if (invalid.length) {
      const batch = this.db.batch();
      tokenSnap.docs.forEach((d) => {
        const t = (d.data() as any).token;
        if (invalid.includes(t)) batch.delete(d.ref);
      });
      await batch.commit();
    }

    return { sent: res.successCount, failed: res.failureCount };
  }

  async notify(
    payload: Omit<FirestoreNotification, 'createdAt' | 'updatedAt' | 'readAt'>,
    pushAlso = true,
  ) {
    // mutedTypes check
    const prefs = (await this.getPrefs(payload.userId)) as any;
    const muted: string[] = prefs?.mutedTypes ?? [];
    if (muted.includes(payload.type as any)) {
      // still create in-app? you can decide. Here: create in-app but no push.
      pushAlso = false;
    }

    const created = await this.createInApp(payload);

    if (!pushAlso) return { created, push: null };

    const pushTitle = payload.title ?? 'Notification';
    const pushBody = payload.message ?? '';

    const pushData: Record<string, string> = {
      notificationId: created.id!,
      type: String(payload.type ?? ''),
      entityType: String(payload.entityType ?? ''),
      entityId: String(payload.entityId ?? ''),
      deepLink: String(payload.deepLink ?? ''),
      groupKey: String(payload.groupKey ?? ''),
    };

    const push = await this.sendPushToUser(payload.userId, pushTitle, pushBody, pushData);
    return { created, push };
  }

  // --------------------
  // List (pagination)
  // Firestore doesn't support OFFSET well, so we do "page" as best-effort using extra fetch.
  // For production: use cursor (startAfter) pagination.
  // --------------------
  async list(userId: string, query: NotificationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    let qRef: FirebaseFirestore.Query = this.notifCol(userId);

    if (query.status) qRef = qRef.where('status', '==', query.status);
    if (query.type) qRef = qRef.where('type', '==', query.type);
    if (query.groupKey) qRef = qRef.where('groupKey', '==', query.groupKey);

    qRef = qRef.orderBy('createdAt', 'desc');

    // "skip" simulation (not ideal)
    const want = page * limit;
    const snap = await qRef.limit(want).get();
    const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

    const items = docs.slice((page - 1) * limit, page * limit);
    const total = docs.length; // best-effort (real total needs count aggregation / separate store)

    return { page, limit, total, items };
  }

  async unreadCount(userId: string) {
    const snap = await this.notifCol(userId).where('status', '==', NotificationStatus.UNREAD).get();
    return { unread: snap.size };
  }

  async markRead(userId: string, id: string) {
    const ref = this.notifCol(userId).doc(id);
    const snap = await ref.get();
    if (!snap.exists) throw new NotFoundException('Notification not found');

    await ref.set(
      {
        status: NotificationStatus.READ,
        readAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return { updated: true };
  }

  async markAllRead(userId: string) {
    const snap = await this.notifCol(userId).where('status', '==', NotificationStatus.UNREAD).get();
    if (snap.empty) return { updated: 0 };

    const batch = this.db.batch();
    snap.docs.forEach((d) => {
      batch.set(
        d.ref,
        {
          status: NotificationStatus.READ,
          readAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    });
    await batch.commit();
    return { updated: snap.size };
  }

  async archive(userId: string, id: string) {
    const ref = this.notifCol(userId).doc(id);
    const snap = await ref.get();
    if (!snap.exists) throw new NotFoundException('Notification not found');

    await ref.set(
      {
        status: NotificationStatus.ARCHIVED,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return { archived: true };
  }

  async delete(userId: string, id: string) {
    await this.notifCol(userId).doc(id).delete();
    return { deleted: true };
  }

  // Optional: groupKey dedup (update existing instead of creating new)
  async notifyGrouped(payload: Omit<FirestoreNotification, 'createdAt' | 'updatedAt' | 'readAt'>, pushAlso = true) {
    if (!payload.groupKey) throw new BadRequestException('groupKey required');

    const existing = await this.notifCol(payload.userId)
      .where('groupKey', '==', payload.groupKey)
      .where('status', '!=', NotificationStatus.ARCHIVED)
      .limit(1)
      .get();

    if (!existing.empty) {
      const doc = existing.docs[0];
      await doc.ref.set(
        {
          ...payload,
          status: NotificationStatus.UNREAD,
          readAt: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      // push (optional)
      if (pushAlso) {
        await this.sendPushToUser(
          payload.userId,
          payload.title ?? 'Notification',
          payload.message ?? '',
          {
            notificationId: doc.id,
            type: String(payload.type ?? ''),
            entityType: String(payload.entityType ?? ''),
            entityId: String(payload.entityId ?? ''),
            deepLink: String(payload.deepLink ?? ''),
            groupKey: String(payload.groupKey ?? ''),
          },
        );
      }

      return { updatedExisting: true, id: doc.id };
    }

    return this.notify(payload, pushAlso);
  }
}