import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface UserPayload {
  sub: string;
  email: string;
  role?: string;
  [key: string]: any;
}

interface RequestWithUser extends Request {
  user: UserPayload;
}

export const GetUser = createParamDecorator(
  (
    data: keyof UserPayload | undefined,
    ctx: ExecutionContext,
  ): string | UserPayload | null => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    if (!request.user) return null;

    if (data && data in request.user) {
      return request.user[data] as string;
    }
    return request.user;
  },
);