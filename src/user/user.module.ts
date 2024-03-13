import { Module } from '@nestjs/common';
import { Connection, createConnection } from './connection/connection';
import { MailService, mailService } from './mail/mail.service';
import { MemberService } from './member/member.service';
import {
  UserRepository,
  createUserRepository,
} from './user-repository/user-repository';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: Connection,
      useFactory: createConnection,
      inject: [ConfigService],
      // useClass:
      //   process.env.DATABASE === 'mysql' ? MySQLConnection : MongoDBConnection,
    },
    {
      provide: MailService,
      useValue: mailService,
    },
    {
      provide: 'EmailService',
      useExisting: MailService,
    },
    {
      provide: UserRepository,
      useFactory: createUserRepository,
      inject: [Connection],
    },
    MemberService,
  ],
})
export class UserModule {}
