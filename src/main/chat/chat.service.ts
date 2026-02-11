import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SendMessageDto } from './dto/send-message.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ReceiptStatus } from 'generated/prisma/enums';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  private assertExternalUrlAllowed(fileUrl: string) {
    let u: URL;
    try { u = new URL(fileUrl); } catch { throw new BadRequestException('Invalid fileUrl'); }
    if (u.protocol !== 'https:') throw new BadRequestException('Only https URLs allowed');

    // If you want to enforce your upload domain, uncomment:
    // if (!fileUrl.startsWith(process.env.ALLOWED_UPLOAD_DOMAIN)) {
    //   throw new ForbiddenException('Invalid file URL');
    // }
  }

  private async assertParticipant(conversationId: string, userId: string) {
    const p = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
      select: { id: true },
    });
    if (!p) throw new ForbiddenException('Not a participant');
  }

  // 1-to-1 conversation find/create
  async getOrCreateOneToOneConversation(userId: string, otherUserId: string) {
    if (userId === otherUserId) throw new BadRequestException('Cannot chat with self');

    // Find existing conversation with exactly these two participants and isGroup=false
    const existing = await this.prisma.conversation.findFirst({
      where: {
        isGroup: false,
        participants: { some: { userId } },
        AND: [{ participants: { some: { userId: otherUserId } } }],
      },
      include: { participants: true },
    });

    if (existing && existing.participants.length === 2) return existing;

    return this.prisma.conversation.create({
      data: {
        isGroup: false,
        participants: {
          createMany: { data: [{ userId }, { userId: otherUserId }] },
        },
      },
      include: { participants: true },
    });
  }

  async sendMessage(userId: string, dto: SendMessageDto) {
    const hasText = !!dto.content?.trim();
    const hasFile = !!dto.fileUrl?.trim();

    if (!hasText && !hasFile) {
      throw new BadRequestException('Either content or fileUrl is required');
    }
    if (hasFile) this.assertExternalUrlAllowed(dto.fileUrl!);

    const convo = await this.getOrCreateOneToOneConversation(userId, dto.receiverId);

    // idempotency by (conversationId, senderId, clientMsgId)
    if (dto.clientMsgId) {
      const existing = await this.prisma.message.findUnique({
        where: {
          conversationId_senderId_clientMsgId: {
            conversationId: convo.id,
            senderId: userId,
            clientMsgId: dto.clientMsgId,
          },
        },
        include: { messageReceipts: true },
      });
      if (existing) return existing;
    }

    const msg = await this.prisma.$transaction(async (tx) => {
      const created = await tx.message.create({
        data: {
          conversationId: convo.id,
          senderId: userId,
          content: hasText ? dto.content!.trim() : null,
          fileUrl: hasFile ? dto.fileUrl!.trim() : null,
          clientMsgId: dto.clientMsgId ?? null,
          messageReceipts: {
            createMany: {
              data: [
                { userId, status: ReceiptStatus.READ },
                { userId: dto.receiverId, status: ReceiptStatus.SENT },
              ],
            },
          },
        },
        include: { messageReceipts: true },
      });

     
      await tx.conversationParticipant.update({
        where: { conversationId_userId: { conversationId: convo.id, userId: dto.receiverId } },
        data: { unreadCount: { increment: 1 } },
      });

      await tx.conversation.update({
        where: { id: convo.id },
        data: {
          lastMessageId: created.id,
          lastMessageAt: created.createdAt,
        },
      });

      return created;
    });

    return msg;
  }

  async listConversations(userId: string, limit = 20, offset = 0) {
    const rows = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      orderBy: { conversation: { lastMessageAt: 'desc' } },
      select: {
        conversationId: true,
        unreadCount: true,
        lastReadAt: true,
        conversation: {
          select: {
            id: true,
            lastMessageAt: true,
            lastMessage: {
              select: { id: true, content: true, fileUrl: true, senderId: true, createdAt: true },
            },
            participants: { select: { userId: true } },
          },
        },
      },
    });

    return rows.map((r) => ({
      conversationId: r.conversationId,
      unreadCount: r.unreadCount,
      lastReadAt: r.lastReadAt,
      lastMessageAt: r.conversation.lastMessageAt,
      lastMessage: r.conversation.lastMessage,
      participants: r.conversation.participants.map((p) => p.userId),
    }));
  }

  async listMessages(userId: string, conversationId: string, limit = 30, cursorId?: string) {
    await this.assertParticipant(conversationId, userId);

    const cursor = cursorId ? { id: cursorId } : undefined;

    const msgs = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor ? { cursor, skip: 1 } : {}),
      select: {
        id: true,
        conversationId: true,
        senderId: true,
        content: true,
        fileUrl: true,
        createdAt: true,
        messageReceipts: { select: { userId: true, status: true, updatedAt: true } },
      },
    });

    return msgs.reverse();
  }

  async markDelivered(userId: string, conversationId: string) {
    await this.assertParticipant(conversationId, userId);

    await this.prisma.messageReceipt.updateMany({
      where: {
        userId,
        message: { conversationId },
        status: ReceiptStatus.SENT,
      },
      data: { status: ReceiptStatus.DELIVERED },
    });

    return { ok: true };
  }

  async markRead(userId: string, conversationId: string, messageId: string) {
    await this.assertParticipant(conversationId, userId);

    const msg = await this.prisma.message.findFirst({
      where: { id: messageId, conversationId },
      select: { id: true, createdAt: true },
    });
    if (!msg) throw new NotFoundException('Message not found');

    await this.prisma.$transaction(async (tx) => {
      await tx.messageReceipt.updateMany({
        where: {
          userId,
          message: { conversationId, createdAt: { lte: msg.createdAt } },
          status: { in: [ReceiptStatus.SENT, ReceiptStatus.DELIVERED] },
        },
        data: { status: ReceiptStatus.READ },
      });

      await tx.conversationParticipant.update({
        where: { conversationId_userId: { conversationId, userId } },
        data: { unreadCount: 0, lastReadAt: new Date() },
      });
    });

    return { ok: true };
  }

  async getOtherParticipantId(conversationId: string, userId: string) {
    const parts = await this.prisma.conversationParticipant.findMany({
      where: { conversationId },
      select: { userId: true },
    });
    const other = parts.map((p) => p.userId).find((id) => id !== userId);
    if (!other) throw new NotFoundException('Other participant not found');
    return other;
  }
}