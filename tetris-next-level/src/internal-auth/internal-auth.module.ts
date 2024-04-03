import { Module } from '@nestjs/common';
import { InternalAuthService } from './internal-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { InternalAuthController } from './internal-auth.controller';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET_INTERNAL,
            signOptions: {
                expiresIn: '7d',
            },
        }),
    ],
    controllers: [InternalAuthController],
    providers: [InternalAuthService],
})
export class InternalAuthModule {}
