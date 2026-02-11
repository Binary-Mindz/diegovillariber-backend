import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';


@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  },
  namespace: '/chat',
})
@Injectable()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.logger.log(`Chat WebSocket Gateway initialized (${server.adapter.name})`);
  }

  async handleConnection(client: Socket) {
    try {
      const token = this.extractTokenFromSocket(client);
      if (!token) return this.disconnectWithError(client, 'Missing token');

      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });

      const userId = payload?.sub;
      if (!userId) return this.disconnectWithError(client, 'Invalid token payload');

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });

      if (!user) return this.disconnectWithError(client, 'User not found');

      client.data.userId = user.id;
      client.data.user = user;

      client.join(user.id);

      this.logger.log(`User connected: ${user.id} (socket ${client.id})`);
      client.emit('connection_success', {
        message: 'Connected successfully',
        user,
      });

    
      this.server.emit('presence.online', { userId: user.id });
    } catch (error: any) {
      this.disconnectWithError(client, error?.message ?? 'Authentication failed');
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId as string | undefined;
    if (userId) {
      client.leave(userId);
      this.logger.log(`User disconnected: ${userId}`);
      this.server.emit('presence.offline', { userId });
    } else {
      this.logger.log(`Unauthenticated socket disconnected (${client.id})`);
    }
  }

  private extractTokenFromSocket(client: Socket): string | null {
    try {
      return (
        (client.handshake.auth?.token as string) ||
        (client.handshake.query?.token as string) ||
        (client.handshake.headers?.authorization as string)?.split(' ')[1] ||
        null
      );
    } catch {
      return null;
    }
  }

  private disconnectWithError(client: Socket, message: string) {
    this.logger.warn(`Disconnecting client: ${message}`);
    client.emit('error', { message });
    client.disconnect(true);
  }


  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      receiverId: string;
      content?: string;
      fileUrl?: string;   
      clientMsgId?: string; 
    },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data?.userId as string | undefined;
    if (!senderId) {
      client.emit('error', { message: 'Unauthenticated socket' });
      return;
    }

    const { receiverId, content, fileUrl, clientMsgId } = data;

    if (!receiverId) {
      client.emit('error', { message: 'receiverId is required' });
      return;
    }

    const saved = await this.chatService.sendMessage(senderId, {
      receiverId,
      content,
      fileUrl,
      clientMsgId,
    });

    this.server.to(receiverId).emit('receive_message', saved);
    this.server.to(senderId).emit('receive_message', saved);

   
    client.emit('message_sent', { success: true, messageId: saved.id, clientMsgId });
  }


  @SubscribeMessage('get_user_history')
  async getUserChatHistory(
    @MessageBody() data: { userId?: string; limit?: number; offset?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = (client.data?.userId as string | undefined) ?? data.userId;
    if (!userId) return client.emit('error', { message: 'userId missing' });

    const limit = Math.min(Math.max(data.limit ?? 20, 1), 100);
    const offset = Math.max(data.offset ?? 0, 0);

    const inbox = await this.chatService.listConversations(userId, limit, offset);
    client.emit('user_history', inbox);
  }

 
  @SubscribeMessage('get_conversation')
  async getMessagesBetweenUsers(
    @MessageBody() data: { userA?: string; userB: string; limit?: number; cursorId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userA = (client.data?.userId as string | undefined) ?? data.userA;
    const userB = data.userB;

    if (!userA || !userB) {
      client.emit('error', { message: 'userA and userB are required' });
      return;
    }

    const convo = await this.chatService.getOrCreateOneToOneConversation(userA, userB);

    const limit = Math.min(Math.max(data.limit ?? 30, 1), 100);
    const messages = await this.chatService.listMessages(userA, convo.id, limit, data.cursorId);

    client.emit('conversation', {
      conversationId: convo.id,
      userA,
      userB,
      messages,
    });

    await this.chatService.markDelivered(userA, convo.id);
    this.server.to(userB).emit('receipt_delivered', { conversationId: convo.id, byUserId: userA });
  }


  @SubscribeMessage('get_partners')
  async getChatPartners(
    @MessageBody() data: { userId?: string; limit?: number; offset?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = (client.data?.userId as string | undefined) ?? data.userId;
    if (!userId) return client.emit('error', { message: 'userId missing' });

    const limit = Math.min(Math.max(data.limit ?? 50, 1), 100);
    const offset = Math.max(data.offset ?? 0, 0);

    const partners = await this.chatService.getChatPartnersWithUser(userId, limit, offset);
    client.emit('partners_list', partners);
  }


  @SubscribeMessage('delete_message')
  async removeMessage(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data?.userId as string | undefined;
    if (!userId) return client.emit('error', { message: 'Unauthenticated socket' });

    const { messageId } = data;
    if (!messageId) return client.emit('error', { message: 'messageId required' });

    const deleted = await this.chatService.removeMessage(userId, messageId);

    this.server.to(deleted.senderId).emit('message_deleted', { messageId, success: true });
    const otherUserId = await this.chatService.getOtherParticipantId(deleted.conversationId, userId);
    this.server.to(otherUserId).emit('message_deleted', { messageId, success: true });

    client.emit('message_deleted', { messageId, success: true });
  }


  @SubscribeMessage('mark_read')
  async markRead(
    @MessageBody() data: { conversationId: string; messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data?.userId as string | undefined;
    if (!userId) return client.emit('error', { message: 'Unauthenticated socket' });

    await this.chatService.markRead(userId, data.conversationId, data.messageId);

    const otherUserId = await this.chatService.getOtherParticipantId(data.conversationId, userId);
    this.server.to(otherUserId).emit('receipt_read', {
      conversationId: data.conversationId,
      messageId: data.messageId,
      byUserId: userId,
    });

    client.emit('read_ok', { ok: true });
  }

  @SubscribeMessage('typing')
  typing(
    @MessageBody() data: { receiverId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data?.userId as string | undefined;
    if (!userId) return;

    this.server.to(data.receiverId).emit('typing', {
      fromUserId: userId,
      isTyping: !!data.isTyping,
    });
  }
}