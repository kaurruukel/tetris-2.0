import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewScoreDto } from './dto/new-score.dto';
import { Leaderboard } from './leaderboard.entity';

@Injectable()
export class LeaderboardService {
    constructor(
        @InjectRepository(Leaderboard)
        private leaderboardRepository: Repository<Leaderboard>,
        private jwtService: JwtService,
    ) {}

    async create(newScoreDto: NewScoreDto) {
        const newScore = this.leaderboardRepository.create({
            ...newScoreDto,
        });
        return await this.leaderboardRepository.save(newScore);
    }

    async getTop(header: string) {
        const top10 = (await this.leaderboardRepository.find())
            .sort((a, b) => b.score - a.score)
            .splice(0, 10);

        const personalScores = (
            await this.leaderboardRepository.find({
                where: {
                    user_uuid: this.jwtService.decode(header)['uuid'],
                },
            })
        ).reverse();

        const returnTop10 = top10.map((entry) => {
            return {
                name: entry.name,
                score: entry.score,
                level: entry.level,
                usedShapes: entry.usedShapes,
                endGameState: entry.endGameState,
            };
        });

        return {
            top10: returnTop10,
            personalScores: personalScores.map((entry) => {
                return {
                    name: entry.name,
                    score: entry.score,
                    level: entry.level,
                    usedShapes: entry.usedShapes,
                    endGameState: entry.endGameState,
                };
            }),
        };
    }
}
