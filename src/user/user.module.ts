import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, createConnection } from './connection/connection';
import { MailService, mailService } from './mail/mail.service';
import { MemberService } from './member/member.service';
import { UserRepository } from './user-repository/user-repository';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
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
    UserRepository,
    //#Factory
    // {
    //   provide: UserRepository,
    //   useFactory: createUserRepository,
    //   inject: [Connection],
    // },
    MemberService,
  ],
  exports: [UserService], //sharing modules
})
export class UserModule {}
