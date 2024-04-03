import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common';
import { Credentials } from '../users/interfaces/credentials.interface';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    /**
     *
     * @param credentials the credentials of the user that is trying to log in
     * @returns the bearer token or throws an error
     */
    async signIn(credentials: Credentials): Promise<any> {
        const user = await this.userService.findOneByEmail(credentials.email);

        if (
            !user ||
            !(await bcrypt.compare(credentials.password, user?.password))
        ) {
            throw new HttpException(
                'Wrong password or email',
                HttpStatus.BAD_REQUEST,
            ); /// wrong username or password
        }

        // Check if user has verified their email
        if (!user?.authenticated) {
            throw new HttpException(
                'Please verify your email',
                HttpStatus.CONFLICT,
            );
        }

        const payload = {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async generateAuthTokenWithoutPassword(user: User) {
        if (!user.uuid || !user.email) {
            return;
        }

        const payload = {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
        };
        return await this.jwtService.signAsync(payload);
    }
}
