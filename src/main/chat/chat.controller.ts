import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ListMessagesDto } from './dto/list-messages.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ListConversationsDto } from './dto/list-conversion.dto';
import { GetUser } from '@/common/decorator/get-user.decorator';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Inbox / Conversations list' })
  @Get('conversations')
  conversations( @GetUser('userId') userId: string, @Query() q: ListConversationsDto) {
    return this.chatService.listConversations(userId, q.limit, q.offset);
  }

  @ApiOperation({ summary: 'Messages in a conversation (cursor pagination)' })
  @Get('messages')
  messages( @GetUser('userId') userId: string, @Query() q: ListMessagesDto) {
    return this.chatService.listMessages(userId, q.conversationId, q.limit, q.cursorId);
  }

  @ApiOperation({ summary: 'Send message (text or fileUrl)' })
  @Post('send')
  send( @GetUser('userId') userId: string, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(userId, dto);
  }

  @ApiOperation({ summary: 'Mark read up to messageId' })
  @Post('read')
  read( @GetUser('userId') userId: string, @Body() dto: MarkReadDto) {
    return this.chatService.markRead(userId, dto.conversationId, dto.messageId);
  }
}