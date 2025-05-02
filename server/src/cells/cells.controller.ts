import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CellsService } from './cells.service';
import { CreateCellDto } from './dto/create-cell.dto';
import { UpdateCellDto } from './dto/update-cell.dto';

@Controller('cells')
export class CellsController {
  constructor(private readonly cellsService: CellsService) {}

  @Post()
  create(@Body() createCellDto: CreateCellDto) {
    return this.cellsService.create(createCellDto);
  }

  @Get()
  findAll() {
    return this.cellsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cellsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCellDto: UpdateCellDto) {
    return this.cellsService.update(id, updateCellDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cellsService.remove(id);
  }

  @Get('container/:containerId')
  findByContainer(@Param('containerId') containerId: string) {
    return this.cellsService.findByContainer(+containerId);
  }

  @Get('size/:sizeId')
  findBySize(@Param('sizeId') sizeId: string) {
    return this.cellsService.findBySize(sizeId);
  }
} 