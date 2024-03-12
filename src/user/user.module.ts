import { Module } from '@nestjs/common';
import {
  Connection,
  MongoDBConnection,
  MySQLConnection,
} from './connection/connection';
import { MailService, mailService } from './mail/mail.service';
import {
  UserRepository,
  createUserRepository,
} from './user-repository/user-repository';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { MemberService } from './member/member.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: Connection,
      useClass:
        process.env.DATABASE === 'mysql' ? MySQLConnection : MongoDBConnection,
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
