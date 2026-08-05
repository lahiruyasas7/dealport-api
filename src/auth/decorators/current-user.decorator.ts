import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../types/jwt-payload.interface';

/**
 * Usage: create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateProductDto)
 * Only valid on routes protected by JwtAuthGuard — req.user is populated
 * by JwtStrategy.validate().
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
