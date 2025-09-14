import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('logs')
export class LogsController {
  private readonly logsDir = process.env.LOGS_DIR || path.join(__dirname, '..', '..', 'logs');

  /**
   * Возвращает список доступных лог-файлов.
   * Только для ролей SUPERADMIN.
   */
  @Get('files')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  getLogFiles(): string[] {
    if (!fs.existsSync(this.logsDir)) {
      return [];
    }

    const files = fs.readdirSync(this.logsDir)
      .filter(f => f.endsWith('.log') || f.endsWith('.log.gz'))
      .map(f => ({ name: f, time: fs.statSync(path.join(this.logsDir, f)).mtime.getTime() }))
      .sort((a, b) => b.time - a.time)
      .map(f => f.name);

    return files;
  }

  /**
   * Возвращает последние N строк указанного лог-файла или последнего лог-файла.
   * Только для ролей SUPERADMIN.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  getLastLines(
    @Query('lines') lines = '200',
    @Query('file') logFile?: string,
  ): string[] {
    const linesNum = Number(lines);
    if (isNaN(linesNum) || linesNum <= 0) {
      throw new BadRequestException('Query param "lines" должен быть положительным числом');
    }

    let targetFile: string | null;

    if (logFile) {
      if (logFile.includes('..')) {
        throw new BadRequestException('Недопустимое имя файла.');
      }
      targetFile = path.join(this.logsDir, logFile);
      if (!fs.existsSync(targetFile)) {
        throw new BadRequestException(`Файл логов ${logFile} не найден.`);
      }
    } else {
      const latestLogFileName = this.getLatestLogFile(this.logsDir);
      targetFile = latestLogFileName ? path.join(this.logsDir, latestLogFileName) : null;
    }

    if (!targetFile) {
      return [];
    }

    const data = fs.readFileSync(targetFile, 'utf-8');
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
    
    return files.length > 0 ? files[0].name : null;
  }
} 