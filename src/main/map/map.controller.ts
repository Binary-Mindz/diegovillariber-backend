import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { handleRequest } from '@/common/helpers/handle.request';
import { MapService } from './map.service';
import { MapQueryDto } from './dto/map-query.dto';

@ApiTags('Map')
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('markers')
  @ApiOperation({ summary: 'Get map markers with filters' })
  async getMarkers(@Query() query: MapQueryDto) {
    return handleRequest(
      () => this.mapService.getMapMarkers(query),
      'Map markers fetched successfully',
      HttpStatus.OK,
    );
  }

  @Get('details/:type/:id')
  @ApiOperation({ summary: 'Get map card details by type and id' })
  async getDetails(
    @Param('type') type: string,
    @Param('id') id: string,
  ) {
    return handleRequest(
      () => this.mapService.getMapDetails(type.toLowerCase(), id),
      'Map details fetched successfully',
      HttpStatus.OK,
    );
  }
}