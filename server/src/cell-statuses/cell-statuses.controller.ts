import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CellStatusesService } from './cell-statuses.service';
import { CreateCellStatusDto, UpdateCellStatusDto } from './dto';

@Controller('cell-statuses')
export class CellStatusesController {
  constructor(private readonly cellStatusesService: CellStatusesService) {}

  @Post()
  create(@Body() createCellStatusDto: CreateCellStatusDto) {
    return this.cellStatusesService.create(createCellStatusDto);
  }

  @Get()
  findAll() {
    return this.cellStatusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cellStatusesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCellStatusDto: UpdateCellStatusDto,
  ) {
    return this.cellStatusesService.update(id, updateCellStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cellStatusesService.remove(id);
  }
} 