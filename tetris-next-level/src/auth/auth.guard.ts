import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InternalAuthGuard } from '../internal-auth/internal-auth.guard';

@Injectable()
export class AuthGuard extends InternalAuthGuard implements CanActivate {
    constructor(protected readonly jwtService: JwtService) {
        super(jwtService);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        if (!token) throw new UnauthorizedException();

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            request['user'] = payload;
            return true;
        } catch {
            return await super.canActivate(context);
        }
    }
}
