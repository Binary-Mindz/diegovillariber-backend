import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { ListConversationsDto } from './dto/list-conversion.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { ListMessagesDto } from './dto/list-messages.dto';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @ApiOperation({ summary: 'List conversations (inbox)' })
  @Get('conversations')
  listConversations(@GetUser('userId') userId: string, @Query() q: ListConversationsDto) {
    return this.chat.listConversations(userId, q.limit, q.offset);
  }

  @ApiOperation({ summary: 'List messages in a conversation (cursor pagination)' })
  @Get('messages')
  listMessages(@GetUser('userId') userId: string, @Query() q: ListMessagesDto) {
    return this.chat.listMessages(userId, q.conversationId, q.limit, q.cursorId);
  }

  @ApiOperation({ summary: 'Send message (text or fileUrl)' })
  @Post('send')
  send(@GetUser('userId') userId: string, @Body() dto: SendMessageDto) {
    return this.chat.sendMessage(userId, dto);
  }

  @ApiOperation({ summary: 'Mark messages as READ up to messageId' })
  @Post('read')
  markRead(@GetUser('userId') userId: string, @Body() dto: MarkReadDto) {
    return this.chat.markRead(userId, dto.conversationId, dto.messageId);
  }
}