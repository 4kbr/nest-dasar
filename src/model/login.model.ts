import { z } from 'zod';

export class LoginUserRequest {
  username: string;
  password: string;
}

export const loginUserRequestValidation = z.object({
  username: z.string().max(100).min(1),
  password: z.string().max(100).min(1),
});
