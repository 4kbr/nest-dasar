import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ValidationFilter implements ExceptionFilter<ZodError> {
  catch(exception: Error, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    if (exception instanceof ZodError) {
      return response.status(400).json({
        code: 400,
        errors: exception.errors,
      });
    } else {
      return response.status(500).json({
        code: 500,
        errors: exception,
      });
    }
  }
}
