import {
    BadRequestException,
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as hbs from 'nodemailer-express-handlebars';
import { CreateUserDto } from './dto/create-user.dto';
import { ResendEmailDto } from './dto/resend-email.dto';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    /**
     *
     * @returns A list of all the users
     */
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    /**
     *
     * @param uuid the uuid of the user whose db entry is being searched
     * @returns the found user or throws an exception
     */
    async findOneByUUid(uuid: string): Promise<User | null> {
        return this.userRepository.findOneBy({ uuid });
    }

    /**
     *
     * @param name the username of the user
     * @returns the found user
     */
    async findOneByUsername(name: string): Promise<User | null> | undefined {
        return await this.userRepository.findOneBy({
            name,
        });
    }

    /**
     *
     * @param name the username of the user
     * @returns the found user
     */
    async findOneByEmail(email: string): Promise<User | null> | undefined {
        return await this.userRepository.findOneBy({
            email,
        });
    }

    /**
     * Creates a new account with the
     *
     * @param user the user dto
     * @returns the created database entry
     */
    async create(createUserDto: CreateUserDto): Promise<User | HttpException> {
        // if (await this.findOneByUsername(createUserDto.name)) {
        //     throw new HttpException(
        //         'Username already exists',
        //         HttpStatus.BAD_REQUEST,
        //     );
        // } // TODO: verify also on the db level
        // if (await this.findOneByEmail(createUserDto.email)) {
        //     throw new HttpException(
        //         'Email already exists',
        //         HttpStatus.BAD_REQUEST,
        //     );
        // }

        const hashedPassword = await this.hashPassword(createUserDto.password);

        try {
            const newUser = this.userRepository.create({
                name: createUserDto.name,
                email: createUserDto.email,
                password: hashedPassword,
                authenticated: false,
                admin: false,
            });
            const user = await this.userRepository.save(newUser);
            this.sendEmail(user);
            return user;
        } catch (error) {
            if (error.code == '23505') {
                throw new BadRequestException('Username already exists');
            } else {
                throw new InternalServerErrorException('Internal server error');
            }
        }
    }

    public async resendEmail(name: ResendEmailDto['name']) {
        const user = await this.findOneByUsername(name);
        if (user) return this.sendEmail(user);
    }

    /**
     * Validates an accounts email.
     *
     * @param id the uuid of the account whose email is getting validated
     * @returns string or HttpException, if the account was not found
     */
    async validate(uuid: string): Promise<object | HttpException> {
        const user = await this.userRepository.findOneBy({
            uuid: uuid,
        });

        const result = await this.userRepository.save({
            ...user,
            authenticated: true,
        });
        if (result) {
            return {
                status: HttpStatus.OK,
                message: 'Your email has been successfully validated!',
            };
        }
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    public async sendResetPasswordEmail(usernameOrEmail: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: [{ name: usernameOrEmail }, { email: usernameOrEmail }],
        });

        if (!user) {
            throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
        }

        this.sendEmail(user, true);
        return {
            email: user['email'],
        };
    }

    public async resetPassword(
        newPassword: string,
        token: string,
    ): Promise<any> {
        const payload = this.jwtService.decode(token);

        const user = await this.findOneByUUid(payload['uuid']);
        if (!user)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        user.password = await this.hashPassword(newPassword);

        this.userRepository.save(user);
    }

    public async changeUsernameOrEmail(
        dto: {
            email: string;
            name: string;
        },
        token: string,
    ) {
        const payload = this.jwtService.decode(token);
        let user = await this.findOneByUUid(payload['uuid']);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // if the username is getting changed then we check that the new username doesn't already exist
        if (
            user.name !== dto.name &&
            (await this.findOneByUsername(dto.name))
        ) {
            throw new HttpException(
                'Username already exists',
                HttpStatus.BAD_REQUEST,
            );
        }

        // if the email is getting changed then we check that the new email doesn't already exist
        if (
            user.email !== dto.email &&
            (await this.findOneByEmail(dto.email))
        ) {
            throw new HttpException(
                'This email already exists',
                HttpStatus.BAD_REQUEST,
            );
        }

        user = {
            ...user,
            ...dto,
        };

        this.userRepository.save(user);

        const newToken =
            await this.authService.generateAuthTokenWithoutPassword(user);
        return {
            token: newToken,
        };
    }

    /**
     * Hashes a given password using bcrypt and salt
     *
     * @param password the password that is getting hashed
     * @returns an hashed password
     */
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    /**
     * Sends an authentication email to the end user
     *
     * @param user the user to whom the email should be sent to
     */
    async sendEmail(user: User, isPasswordResetEmail = false): Promise<void> {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tetris.email.authentication@gmail.com',
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve('/src/templates/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('/src/templates/'),
        };

        transporter.use('compile', hbs(handlebarOptions));

        const mailOptions = {
            from: '"Tetriskj" <tetris.email.authentication@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: isPasswordResetEmail ? 'Password reset' : 'Welcome!',
            template: isPasswordResetEmail ? 'password' : 'email', // the name of the template file i.e email.handlebars
            context: !isPasswordResetEmail
                ? {
                      name: user.name,
                      link: process.env.URL + '/verified-email/' + user.uuid,
                  }
                : {
                      name: user.name,
                      link:
                          process.env.URL +
                          '/reset-password/' +
                          (await this.authService.generateAuthTokenWithoutPassword(
                              user,
                          )),
                  },
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }
}
