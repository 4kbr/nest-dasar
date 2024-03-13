import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private _: UserService, //bisa dipakai kalau sudah disharing di UserModule export:[...]
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
