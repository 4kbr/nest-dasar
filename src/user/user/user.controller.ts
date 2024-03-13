import { User } from '.prisma/client';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpRedirectResponse,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Auth } from 'src/auth/auth.decorator';
import {
  LoginUserRequest,
  loginUserRequestValidation,
} from 'src/model/login.model';
import { Roles } from 'src/role/roles.decorator';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { MemberService } from '../member/member.service';
import { UserRepository } from '../user-repository/user-repository';
import { UserService } from './user.service';

// @Roles(['admin', 'operator']) //bisa digunakan disini
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

  @Get(`/current`)
  // @UseGuards(RoleGuard) //penggunaan guard
  @Roles(['admin', 'operator']) //bisa digunakan disini
  current(@Auth() user: User): Record<string, any> {
    return {
      data: `Hello ${user.first_name} ${user.last_name}`,
    };
  }

  // @UseFilters(ValidationFilter)//karena sudah global jadi tak perlu ditambah (optional)
  @UsePipes(new ValidationPipe(loginUserRequestValidation)) //kalau disini hati hati bukan hanya body yang divalidasi
  @Post('/login')
  @Header(`Content-Type`, 'application/json')
  @UseInterceptors(TimeInterceptor)
  login(
    @Query(`name`) name: string, //ini juga kena validasi
    // @Body(new ValidationPipe(loginUserRequestValidation)) //bisa disini
    @Body() request: LoginUserRequest,
  ) {
    return {
      data: `Hello ${request.username}`,
    };
  }

  @Get(`/create`)
  create(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
  ): Promise<User> {
    if (!firstName) {
      throw new HttpException(
        {
          code: 400,
          errors: `first_name is required`,
        },
        400,
      );
    }
    if (!lastName) {
      throw new HttpException(
        {
          code: 400,
          errors: `last_name is required`,
        },
        400,
      );
    }
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
  @HttpCode(200)
  //@UseFilters(ValidationFilter) // akan pakai global filter
  sayHello(@Query('name') name?: string): string {
    return this.service.sayHello(name);
    // return `Hello ${firstName + ' ' + lastName}`;
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): string {
    // console.log(id * 10); tidak NaN

    return `GET ${id}`;
  }
}
