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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { EventService } from './event.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create event' })
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
  @ApiOperation({ summary: 'Get approved events' })
  async getEvents() {
    return handleRequest(
      () => this.eventService.getEvents(),
      'Events fetched successfully',
    );
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiOperation({ summary: 'Update event (Owner only)' })
  async updateEvent(
    @GetUser('userId') userId: string,
    @Param('id', ParseUUIDPipe) eventId: string,
    @Body() dto: UpdateEventDto,
  ) {
    return handleRequest(
      () => this.eventService.updateEvent(userId, eventId, dto),
      'Event updated successfully',
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiOperation({ summary: 'Delete event (Owner only)' })
  @HttpCode(HttpStatus.OK)
  async deleteEvent(
    @GetUser('userId') userId: string,
    @Param('id', ParseUUIDPipe) eventId: string,
  ) {
    return handleRequest(
      () => this.eventService.deleteEvent(userId, eventId),
      'Event deleted successfully',
    );
  }
}