import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  ParseUUIDPipe, 
  HttpCode, 
  HttpStatus
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CreateRoleDto, UpdateRoleDto, AssignLocationPermissionsDto } from './dto';

@Controller('admin/roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Получить все роли
   */
  @Get()
  @RequirePermissions('roles:read')
  findAll() {
    return this.rolesService.findAll();
  }

  /**
   * Получить роль по ID
   */
  @Get(':id')
  @RequirePermissions('roles:read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  /**
   * Создать новую роль
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions('roles:create')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  /**
   * Обновить роль
   */
  @Patch(':id')
  @RequirePermissions('roles:update')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  /**
   * Удалить роль
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions('roles:delete')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }

  /**
   * Получить все права
   */
  @Get('permissions/all')
  @RequirePermissions('permissions:read')
  findAllPermissions() {
    return this.rolesService.findAllPermissions();
  }

  /**
   * Получить права по категориям
   */
  @Get('permissions/categories')
  @RequirePermissions('permissions:read')
  getPermissionsByCategory() {
    return this.rolesService.getPermissionsByCategory();
  }

  /**
   * Назначить права на конкретную локацию
   */
  @Post('assign-location-permissions')
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions('roles:assign')
  async assignLocationPermissions(@Body() dto: AssignLocationPermissionsDto) {
    return this.rolesService.assignLocationPermissions(dto);
  }

  /**
   * Получить права оператора на локации
   */
  @Get('admin/:adminId/location-permissions')
  @RequirePermissions('roles:read')
  async getAdminLocationPermissions(@Param('adminId', ParseUUIDPipe) adminId: string) {
    return this.rolesService.getAdminLocationPermissions(adminId);
  }
}
