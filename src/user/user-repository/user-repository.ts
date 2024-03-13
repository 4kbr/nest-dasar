import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {
    console.info(`Create user repository`);
  }

  save(firstName: string, lastName?: string) {
    return this.prismaService.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    });
  }
}

///#Factory method
// export function createUserRepository(connection: Connection): UserRepository {
//   const repository = new UserRepository();
//   repository.connection = connection;
//   return repository;
// }
