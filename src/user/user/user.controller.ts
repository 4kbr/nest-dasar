import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpRedirectResponse,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/api/users')
export class UserController {
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
  async sayHelloPromise(
    @Query('first_name') firstName?: string,
    @Query('last_name') lastName?: string,
  ): Promise<string> {
    return `Hello ${firstName + ' ' + lastName}`;
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
  sayHello(
    @Query('first_name') firstName?: string,
    @Query('last_name') lastName?: string,
  ): string {
    return `Hello ${firstName + ' ' + lastName}`;
  }

  @Get('/:id')
  getById(@Req() request: Request): string {
    return `GET ${request.params.id}`;
  }
}
