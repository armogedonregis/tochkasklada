import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PanelsService } from './panels.service';
import { Panel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PanelWithRelays } from './dto/panel.types';

@Controller('panels')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class PanelsController {
  constructor(private readonly panelsService: PanelsService) {}

  @Post()
  create(@Body() createPanelDto: {
    name: string;
    ipAddress: string;
    port: number;
    login: string;
    password: string;
  }): Promise<Panel> {
    return this.panelsService.create(createPanelDto);
  }

  @Get()
  findAll(): Promise<PanelWithRelays[]> {
    return this.panelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PanelWithRelays> {
    return this.panelsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePanelDto: Partial<{
      name: string;
      ipAddress: string;
      port: number;
      login: string;
      password: string;
    }>,
  ): Promise<Panel> {
    return this.panelsService.update(id, updatePanelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.panelsService.remove(id);
  }

  @Post(':id/check-connection')
  checkConnection(@Param('id') id: string): Promise<boolean> {
    return this.panelsService.checkConnection(id);
  }
} 