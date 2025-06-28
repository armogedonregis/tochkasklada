import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('logs')
export class LogsController {
  /**
   * Возвращает последние N строк последнего лог-файла Winston/PM2.
   * Только для ролей SUPERADMIN.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  getLastLines(@Query('lines') lines = '200'): string[] {
    const linesNum = Number(lines);
    if (isNaN(linesNum) || linesNum <= 0) {
      throw new BadRequestException('Query param "lines" должен быть положительным числом');
    }

    // Ищем логи в папке logs внутри директории сервера
    const logsDir = process.env.LOGS_DIR || path.join(__dirname, '..', '..', 'logs');
    const latestLogFile = this.getLatestLogFile(logsDir);
    if (!latestLogFile) {
      return [];
    }

    const data = fs.readFileSync(latestLogFile, 'utf-8');
    const allLines = data.trimEnd().split(/\r?\n/);
    return allLines.slice(-linesNum);
  }

  private getLatestLogFile(dir: string): string | null {
    if (!fs.existsSync(dir)) {
      return null;
    }
    
    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.log') || f.endsWith('.log.gz'))
      .map(f => ({ name: f, time: fs.statSync(path.join(dir, f)).mtime.getTime() }))
      .sort((a, b) => b.time - a.time);
    
    return files.length > 0 ? path.join(dir, files[0].name) : null;
  }
} 