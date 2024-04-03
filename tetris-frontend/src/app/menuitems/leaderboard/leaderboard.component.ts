import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { AppService } from '../../app.service';
import { LeaderBoardResponse, LeaderboardDto } from './interfaces/leaderboard-reponse.interface';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent {
    constructor(
        private appService: AppService,
        private apiService: ApiService,
        public router: Router
    ) {
        this.appService.backgroundColor = '#E5D283';
        this.getInfo();
    }

    public showDetails: boolean = false;

    public leaderboard: LeaderBoardResponse = {
        top10: [],
        personalScores: [],
    };

    public scoreInformation!: LeaderboardDto;

    public whatToShow: 'top10' | 'personalScores' = 'top10';

    private getInfo(): void {
        this.apiService.getLeaderBoard().subscribe({
            next: (res: LeaderBoardResponse) => {
                this.appService.toggleLoading(false);
                this.leaderboard = res as LeaderBoardResponse;
                this.scoreInformation = this.leaderboard.top10[0];
            },
            error: (e: undefined) => console.log(e),
        });
    }

    public showDetailsOf(index: number): void {
        this.showDetails = true;

        this.scoreInformation = this.leaderboard[this.whatToShow][index];
    }
}
