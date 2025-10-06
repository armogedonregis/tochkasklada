import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { comparePassword } from '@/common/utils/password.utils';
import { LoggerService } from '@/infrastructure/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {
    this.logger.log('AuthService instantiated', 'AuthService');
  }

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.log(`Validating user ${email}`, 'AuthService');
    const user = await this.usersService.findByEmail(email);
    
    if (user && await comparePassword(password, user.password)) {
      this.logger.log(`User ${email} validated successfully`, 'AuthService');
      const { password, ...result } = user;
      return result;
    }
    
    this.logger.warn(`User ${email} validation failed`, 'AuthService');
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    this.logger.log(`Generating JWT for user ${user.email}`, 'AuthService');
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
} 