import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpRedirectResponse,
  Inject,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { UserService } from './user.service';
import { MemberService } from '../member/member.service';
import { User } from '.prisma/client';

@Controller('/api/users')
export class UserController {
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepository: UserRepository,
    private memberService: MemberService,
  ) {}

  @Get(`/create`)
  create(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
  ): Promise<User> {
    return this.userRepository.save(firstName, lastName);
  }

  @Get(`/connection`)
  async getConnection(): Promise<string> {
    // this.userRepository.save();
    this.mailService.send();
    this.emailService.send();

    // module reference
    console.info(this.memberService.getConnectionName());
    this.memberService.sendEmail();

    return this.connection.getName();
  }

  @Get(`/view/hello`)
  viewHello(@Query(`name`) name: string, @Res() response: Response) {
    response.render(`index.html`, {
      title: 'Template asli',
      name: name,
    });
  }

  @Get(`/set-cookie`)
  setCookie(@Query(`name`) name: string, @Res() response: Response) {
    response.cookie(`name`, name);
    response.status(200).send(`Success Set Cookie`);
  }

  @Get(`/get-cookie`)
  getCookie(@Req() request: Request): string {
    return request.cookies['name'];
  }

  @Get('/hello-promise')
  async sayHelloPromise(@Query('name') name?: string): Promise<string> {
    return this.service.sayHello(name);
    // return `Hello ${firstName + ' ' + lastName}`;
  }

  @Get('/sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  sampleResponse() {
    return {
      data: `Hello JSON`,
    };
  }
  // sampleResponse(@Res() response: Response) {
  //   response.status(200).json({ oke: 'mantap' });
  // }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users/sample-response',
      statusCode: 301,
    };
  }

  @Post()
  post(): string {
    return 'POST';
  }

  @Get('/sample')
  get() {
    return 'Hello World';
  }

  @Get('/hello')
  sayHello(@Query('name') name?: string): string {
    return this.service.sayHello(name);
    // return `Hello ${firstName + ' ' + lastName}`;
  }

  @Get('/:id')
  getById(@Req() request: Request): string {
    return `GET ${request.params.id}`;
  }
}
