export interface LeaderBoardResponse {
    top10: LeaderboardDto[];
    personalScores: LeaderboardDto[];
}

export interface LeaderboardDto {
    score: number;
    level: number;
    name: string;
    usedShapes: string;
    endGameState: string;
}
