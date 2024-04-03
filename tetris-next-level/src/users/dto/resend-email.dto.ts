import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResendEmailDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    name: string;
}
