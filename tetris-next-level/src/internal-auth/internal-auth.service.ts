import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Credentials } from '../users/interfaces/credentials.interface';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InternalAuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    /**
     *
     * @param credentials the credentials of the user that is trying to log in
     * @returns the internal authentication bearer token or throws an error
     */
    async signIn(credentials: Credentials): Promise<any> {
        const user = await this.userService.findOneByEmail(credentials.email);

        if (
            !user?.admin ||
            !(await bcrypt.compare(credentials.password, user?.password))
        ) {
            throw new UnauthorizedException(); /// wrong password
        }

        const payload = {
            uuid: user.uuid,
            name: user.name,
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
