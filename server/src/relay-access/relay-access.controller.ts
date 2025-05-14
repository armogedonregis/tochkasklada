import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  UseGuards, 
  ParseUUIDPipe, 
  HttpCode, 
  HttpStatus,
  Query
} from '@nestjs/common';
import { RelayAccessService } from './relay-access.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateRelayAccessDto, CheckRelayAccessDto, FindRelayAccessDto } from './dto';

@Controller('admin/relay-access')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class RelayAccessController {
  constructor(private readonly relayAccessService: RelayAccessService) {}

  /**
   * Предоставление доступа к реле
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  grantAccess(@Body() createRelayAccessDto: CreateRelayAccessDto) {
    return this.relayAccessService.grantAccess(createRelayAccessDto);
  }

  /**
   * Получение всех записей доступа к реле с пагинацией и фильтрацией
   */
  @Get()
  findAll(@Query() query: FindRelayAccessDto) {
    return this.relayAccessService.findAll(query);
  }

  /**
   * Получение доступов для конкретной аренды ячейки
   */
  @Get('rental/:rentalId')
  findByRental(@Param('rentalId', ParseUUIDPipe) rentalId: string) {
    return this.relayAccessService.findByRental(rentalId);
  }

  /**
   * Проверка доступа к реле для аренды ячейки
   */
  @Post('check')
  @HttpCode(HttpStatus.OK)
  checkAccess(@Body() checkDto: CheckRelayAccessDto) {
    return this.relayAccessService.checkAccess(checkDto.cellRentalId, checkDto.relayId);
  }

  /**
   * Отзыв доступа к реле
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  revokeAccess(@Param('id', ParseUUIDPipe) id: string) {
    return this.relayAccessService.revokeAccess(id);
  }
} 