import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class NewScoreDto {
    @IsUUID()
    @IsNotEmpty()
    user_uuid: string;

    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    score: number;

    @IsNumber()
    @IsNotEmpty()
    level: number;

    @IsNotEmpty()
    endGameState: string;

    @IsNotEmpty()
    usedShapes: string;
}
