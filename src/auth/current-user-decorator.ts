import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from './jwt.strategy';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest();

    return { ...request.user } as UserPayload;
  },
);
