import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Patch,
  ParseUUIDPipe,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { EventService } from './event.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { GetEventsQueryDto } from './dto/get-event-query.dto';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  async createEvent(
    @GetUser('userId') userId: string,
    @Body() dto: CreateEventDto,
  ) {
    return handleRequest(
      () => this.eventService.createEvent(userId, dto),
      'Event created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get events with filters' })
  @ApiResponse({ status: 200, description: 'Events fetched successfully' })
  async getEvents(@Query() query: GetEventsQueryDto) {
    return handleRequest(
      () => this.eventService.getEvents(query),
      'Events fetched successfully',
      HttpStatus.OK,
    );
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiOperation({ summary: 'Update event (Owner only)' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  async updateEvent(
    @GetUser('userId') userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) eventId: string,
    @Body() dto: UpdateEventDto,
  ) {
    return handleRequest(
      () => this.eventService.updateEvent(userId, eventId, dto),
      'Event updated successfully',
      HttpStatus.OK,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiOperation({ summary: 'Delete event (Owner only)' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @HttpCode(HttpStatus.OK)
  async deleteEvent(
    @GetUser('userId') userId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) eventId: string,
  ) {
    return handleRequest(
      () => this.eventService.deleteEvent(userId, eventId),
      'Event deleted successfully',
      HttpStatus.OK,
    );
  }
}