import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RelaysService } from './relays.service';
import { Relay, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('relays')
@UseGuards(JwtAuthGuard)
export class RelaysController {
  constructor(private readonly relaysService: RelaysService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() createRelayDto: Prisma.RelayCreateInput) {
    return this.relaysService.create(createRelayDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.relaysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relaysService.findOne(id);
  }

  @Post(':id/toggle')
  toggle(@Param('id') id: string, @Body('state') state: boolean) {
    return this.relaysService.toggle(id, state);
  }

  @Post(':id/pulse')
  pulse(@Param('id') id: string) {
    return this.relaysService.pulse(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.relaysService.remove(id);
  }
} 