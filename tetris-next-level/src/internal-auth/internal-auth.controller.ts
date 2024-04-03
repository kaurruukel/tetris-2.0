import { Body, Controller, Post } from '@nestjs/common';
import { Credentials } from '../users/interfaces/credentials.interface';
import { InternalAuthService } from '../internal-auth/internal-auth.service';

@Controller('auth-admin')
export class InternalAuthController {
    constructor(
        private readonly authService: InternalAuthService,
        private readonly internalAuthService: InternalAuthService,
    ) {}

    @Post('login')
    async signIn(@Body() credentials: Credentials) {
        return await this.internalAuthService.signIn(credentials);
    }
}
