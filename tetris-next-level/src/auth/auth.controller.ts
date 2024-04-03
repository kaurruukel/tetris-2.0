import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Credentials } from '../users/interfaces/credentials.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async signIn(@Body() credentials: Credentials) {
        return await this.authService.signIn(credentials);
    }
}
