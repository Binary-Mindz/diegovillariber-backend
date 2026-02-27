import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { VirtualSimEventService } from "./virtual-sim-event.service";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { GetUser } from "@/common/decorator/get-user.decorator";
import { CreateVirtualSimEventDto } from "./dto/create-virtual-sim-event.dto";
import { handleRequest } from "@/common/helpers/handle.request";
import { VirtualSimEventQueryDto } from "./dto/virtual-sim-event-query.dto";
import { UpdateVirtualSimEventDto } from "./dto/update-virtual-sim-event.dto";

@ApiTags('VirtualSimRacingEvent')
@Controller('virtual-sim-events')
export class VirtualSimEventController {
  constructor(private readonly service: VirtualSimEventService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create virtual sim racing event (SIM_RACING_DRIVER only)' })
  create(@GetUser('userId') userId: string, @Body() dto: CreateVirtualSimEventDto) {
    return handleRequest(async () => this.service.create(userId, dto), 'Event created');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List my sim events' })
  list(@GetUser('userId') userId: string, @Query() query: VirtualSimEventQueryDto) {
    return handleRequest(async () => this.service.list(userId, query), 'Events fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get sim event by id' })
  get(@GetUser('userId') userId: string, @Param('id') id: string) {
    return handleRequest(async () => this.service.get(userId, id), 'Event fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update sim event' })
  update(@GetUser('userId') userId: string, @Param('id') id: string, @Body() dto: UpdateVirtualSimEventDto) {
    return handleRequest(async () => this.service.update(userId, id, dto), 'Event updated');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete sim event' })
  delete(@GetUser('userId') userId: string, @Param('id') id: string) {
    return handleRequest(async () => this.service.delete(userId, id), 'Event deleted');
  }
}