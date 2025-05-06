import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { RelayAccessService } from './relay-access.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('relay-access')
@UseGuards(JwtAuthGuard)
export class RelayAccessController {
  constructor(private readonly relayAccessService: RelayAccessService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  grantAccess(@Body() createRelayAccessDto: Prisma.RelayAccessCreateInput) {
    return this.relayAccessService.grantAccess(createRelayAccessDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.relayAccessService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.relayAccessService.findByUser(userId);
  }

  @Post('check')
  checkAccess(
    @Body('userId') userId: string,
    @Body('relayId') relayId: string,
  ) {
    return this.relayAccessService.checkAccess(userId, relayId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  revokeAccess(@Param('id') id: string) {
    return this.relayAccessService.revokeAccess(id);
  }
} 