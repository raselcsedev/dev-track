
import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export interface AuthenticatedUser {
  userId: number;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (
    data: keyof AuthenticatedUser | undefined,
    ctx: ExecutionContext,
  ): AuthenticatedUser | AuthenticatedUser[keyof AuthenticatedUser] => {
    const request = ctx.switchToHttp().getRequest<{
      user: AuthenticatedUser;
    }>();

    const user = request.user;

    return data ? user[data] : user;
  },
);
