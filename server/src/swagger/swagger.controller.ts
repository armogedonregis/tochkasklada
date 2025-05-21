import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SwaggerService } from './swagger.service';

@Controller('swagger')
export class SwaggerController {
  constructor(private readonly swaggerService: SwaggerService) {}

  @Get('json')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async getSwaggerJson() {
    return this.swaggerService.generateDocument();
  }
} 