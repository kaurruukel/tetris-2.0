import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @MinLength(4)
    @IsNotEmpty()
    usernameOrEmail: string;
}
