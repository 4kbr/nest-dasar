import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import * as httpMock from 'node-mocks-http';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should say hello', async () => {
    const response = await controller.sayHelloPromise('Laka', 'Laki');
    expect(response).toBe(`Hello Laka Laki`);
  });

  it('should can view template engine', async () => {
    const response = httpMock.createResponse();
    controller.viewHello('Oke', response);

    expect(response._getRenderView()).toBe(`index.html`);
    expect(response._getRenderData()).toEqual({
      name: `Oke`,
      title: `Template asli`,
    });
  });
});
