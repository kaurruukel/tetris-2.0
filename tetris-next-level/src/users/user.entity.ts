import { Exclude, Expose } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export const GROUP_ADMIN = 'group_user_details';
export const GROUP_ALL_USERS = 'group_all_users';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Expose({
        groups: [GROUP_ADMIN],
    })
    uuid: string;

    @Column({
        unique: true,
    })
    @Expose({
        groups: [GROUP_ADMIN, GROUP_ALL_USERS],
    })
    name: string;

    @Column()
    @Expose({
        groups: [GROUP_ADMIN, GROUP_ALL_USERS],
    })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    @Expose({
        groups: [GROUP_ADMIN],
    })
    authenticated: boolean;

    @Column()
    @Expose({
        groups: [GROUP_ADMIN],
    })
    admin: boolean;
}
