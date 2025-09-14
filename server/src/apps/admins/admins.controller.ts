import { 
  Controller, 
  Get, 
  Post, 
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  /**
   * Получение профиля текущего администратора
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Request() req: any) {
    return this.adminsService.getAdminProfile(req.user.id);
  }

  /**
   * Создание профиля администратора для текущего пользователя
   */
  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createMyProfile(@Request() req: any) {
    return this.adminsService.createAdminProfile(req.user.id);
  }
}
