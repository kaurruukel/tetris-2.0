import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { NewScoreDto } from './dto/new-score.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Headers } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('leaderboard')
export class LeaderboardController {
    constructor(private readonly leaderboardService: LeaderboardService) {}

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() newScoreDto: NewScoreDto) {
        return this.leaderboardService.create(newScoreDto);
    }

    @UseGuards(AuthGuard)
    @SkipThrottle()
    @Get('/top')
    async findAll(@Headers() headers) {
        const authHeader = headers.authorization.split(' ')[1];

        return this.leaderboardService.getTop(authHeader);
    }
}
