import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const GROUP_ALL_USERS = 'group_all_users';

@Entity()
export class Leaderboard {
    @PrimaryGeneratedColumn('uuid')
    uuid: number;

    @Column()
    user_uuid: string;

    @Column()
    name: string;

    @Column()
    @Expose({
        groups: [GROUP_ALL_USERS],
    })
    score: number;

    @Column()
    @Expose({
        groups: [GROUP_ALL_USERS],
    })
    level: number;

    @Column()
    @Expose({
        groups: [GROUP_ALL_USERS],
    })
    endGameState: string;

    @Column()
    @Expose({
        groups: [GROUP_ALL_USERS],
    })
    usedShapes: string;
}
