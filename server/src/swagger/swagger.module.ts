import { DynamicModule, Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SwaggerController } from './swagger.controller';
import { SwaggerService } from './swagger.service';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [SwaggerController],
  providers: [SwaggerService],
  exports: [SwaggerService],
})
export class SwaggerDocModule {
  static forRoot(): DynamicModule {
    return {
      module: SwaggerDocModule,
    };
  }
} 