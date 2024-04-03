import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    HttpException,
    UseInterceptors,
    ClassSerializerInterceptor,
    Param,
    Query,
    SerializeOptions,
    ValidationPipe,
    ParseUUIDPipe,
    Headers,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UserService } from './users.service';
import { GROUP_ADMIN, GROUP_ALL_USERS, User } from './user.entity';
import { InternalAuthGuard } from '../internal-auth/internal-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ResendEmailDto } from './dto/resend-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(InternalAuthGuard)
    @SerializeOptions({
        groups: [GROUP_ADMIN],
    })
    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @SerializeOptions({
        groups: [GROUP_ALL_USERS],
    })
    @Post()
    async create(
        @Body(ValidationPipe) createUserDto: CreateUserDto,
    ): Promise<User | HttpException> {
        return this.userService.create(createUserDto);
    }

    @Post('resend-email')
    async resendEmail(
        @Body(ValidationPipe) resendEmailDto: ResendEmailDto,
    ): Promise<any> {
        return this.userService.resendEmail(resendEmailDto.name);
    }

    @Throttle(3, 300)
    @Post('send-reset-password-email')
    async sendResetPasswordEmail(
        @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
    ): Promise<any> {
        return this.userService.sendResetPasswordEmail(
            resetPasswordDto.usernameOrEmail,
        );
    }

    @UseGuards(AuthGuard)
    @Post('reset-password')
    async resetPassword(
        @Body(ValidationPipe) dto: { newPassword: string; uuid: string },
        @Headers() headers,
    ): Promise<any> {
        const authHeader = headers.authorization.split(' ')[1];
        return this.userService.resetPassword(dto.newPassword, authHeader);
    }

    @Get('validate-email')
    async validate(
        @Query('uuid', new ParseUUIDPipe()) uuid: string,
    ): Promise<any> {
        return this.userService.validate(uuid);
    }

    @UseGuards(AuthGuard)
    // @Throttle(3, 300)
    @Post('change-username-or-email')
    async changeUsernameOrEmail(
        @Body() dto: { email: string; name: string },
        @Headers() headers,
    ): Promise<any> {
        const authHeader = headers.authorization.split(' ')[1];
        return this.userService.changeUsernameOrEmail(dto, authHeader);
    }
}
