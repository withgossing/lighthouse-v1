import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const userId = request.headers['x-user-id'] as string;
        const userRole = request.headers['x-user-role'] as string;

        if (!userId || !userRole) {
            throw new UnauthorizedException('Missing authentication headers');
        }

        (request as any)['user'] = { id: userId, role: userRole };
        return true;
    }
}
