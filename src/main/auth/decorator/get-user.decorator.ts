import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface UserPayload {
  sub: string;
  email: string;
  role?: string;
  [key: string]: any;
}

interface RequestWithUser extends Request {
  user?: UserPayload;
}

export const GetUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) return null;

    if (data === 'id') return user.sub;
    return data ? user[data] : user;
  },
);