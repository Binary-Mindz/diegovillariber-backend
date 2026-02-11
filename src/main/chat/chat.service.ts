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

  private assertHttpsUrl(url: string) {
    let u: URL;
    try { u = new URL(url); } catch { throw new BadRequestException('Invalid fileUrl'); }
    if (u.protocol !== 'https:') throw new BadRequestException('Only https URLs are allowed');
  }

  private async assertParticipant(conversationId: string, userId: string) {
    const p = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
      select: { id: true },
    });
    if (!p) throw new ForbiddenException('Not a participant');
  }

  async getOrCreateOneToOneConversation(userA: string, userB: string) {
    if (userA === userB) throw new BadRequestException('Cannot chat with self');

    const existing = await this.prisma.conversation.findFirst({
      where: {
        isGroup: false,
        participants: { some: { userId: userA } },
        AND: [{ participants: { some: { userId: userB } } }],
      },
      include: { participants: true },
    });

    if (existing && existing.participants.length === 2) return existing;

    return this.prisma.conversation.create({
      data: {
        isGroup: false,
        participants: {
          createMany: { data: [{ userId: userA }, { userId: userB }] },
        },
      },
      include: { participants: true },
    });
  }

  async sendMessage(senderId: string, dto: SendMessageDto) {
    const hasText = !!dto.content?.trim();
    const hasFile = !!dto.fileUrl?.trim();

    if (!hasText && !hasFile) {
      throw new BadRequestException('Either content or fileUrl is required');
    }
    if (hasFile) this.assertHttpsUrl(dto.fileUrl!);

    const convo = await this.getOrCreateOneToOneConversation(senderId, dto.receiverId);

    // idempotency
    if (dto.clientMsgId) {
      const existing = await this.prisma.message.findUnique({
        where: {
          conversationId_senderId_clientMsgId: {
            conversationId: convo.id,
            senderId,
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
          senderId,
          content: hasText ? dto.content!.trim() : null,
          fileUrl: hasFile ? dto.fileUrl!.trim() : null,
          clientMsgId: dto.clientMsgId ?? null,
          messageReceipts: {
            createMany: {
              data: [
                { userId: senderId, status: ReceiptStatus.READ },
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
        data: { lastMessageId: created.id, lastMessageAt: created.createdAt },
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
            participants: {
              select: {
                userId: true,
                user: { select: { id: true, email: true } },
              },
            },
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
      participants: r.conversation.participants.map((p) => p.user),
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

  async getChatPartnersWithUser(userId: string, limit = 50, offset = 0) {
    const inbox = await this.listConversations(userId, limit, offset);

    // return only partners list
    return inbox.map((c) => {
      const other = c.participants.find((p) => p.id !== userId) ?? c.participants[0];
      return {
        conversationId: c.conversationId,
        partner: other,
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt,
        unreadCount: c.unreadCount,
      };
    });
  }

  async removeMessage(userId: string, messageId: string) {
    const msg = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, senderId: true, conversationId: true },
    });
    if (!msg) throw new NotFoundException('Message not found');
    if (msg.senderId !== userId) throw new ForbiddenException('Only sender can delete');

    const convo = await this.prisma.conversation.findUnique({
      where: { id: msg.conversationId },
      select: { lastMessageId: true },
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.messageReceipt.deleteMany({ where: { messageId } });
      await tx.message.delete({ where: { id: messageId } });

      if (convo?.lastMessageId === messageId) {
        await tx.conversation.update({
          where: { id: msg.conversationId },
          data: { lastMessageId: null, lastMessageAt: null },
        });
      }
    });

    return msg; 
  }
}