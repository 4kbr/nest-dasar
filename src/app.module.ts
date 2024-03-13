import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { LogMiddleware } from './log/log.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ValidationModule } from './validation/validation.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './role/role.guard';

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json({}),
      level: 'debug',
      transports: [new winston.transports.Console({})],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PrismaModule,
    ValidationModule.forRoot(true),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LogMiddleware).forRoutes(UserController); //bisa class controller, atau
    consumer.apply(LogMiddleware).forRoutes({
      path: `/api/*`,
      method: RequestMethod.ALL,
    });

    consumer.apply(AuthMiddleware).forRoutes({
      path: `/api/users/current`,
      method: RequestMethod.GET,
    });
  }
}
