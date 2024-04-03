import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LeaderboardDto } from '../../menuitems/leaderboard/interfaces/leaderboard-reponse.interface';
import { levelsInfo } from '../../menuitems/play/constants/levels-info';
import { roundRect } from '../../menuitems/play/helpers/round-rect';
import { InputChangesDto } from '../input/input.event.interface';

@Component({
    selector: 'app-leaderboard-details',
    templateUrl: './leaderboard-details.component.html',
    styleUrls: ['./leaderboard-details.component.scss'],
})
export class LeaderboardDetailsComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        this.drawGameEndState();
        this.drawUsedShapes();
    }

    @Input()
    scoreInformation!: LeaderboardDto;

    @Output()
    closeDetailsEmitter = new EventEmitter<InputChangesDto>();

    @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('usedShapes') usedShapesRef!: ElementRef<HTMLDivElement>;

    private settings = {
        boxWidth: 20,
    };

    private levelsInfo = levelsInfo;

    public closeDetails(): void {
        this.closeDetailsEmitter.emit();
    }

    public drawGameEndState(): void {
        var gameState = JSON.parse(this.scoreInformation.endGameState);

        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.height = gameState.length * this.settings.boxWidth;
        canvas.width = gameState[0].length * this.settings.boxWidth;

        ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

        ctx.lineWidth = 1;
        ctx.beginPath();
        gameState.forEach((line: number[], yCoordinate: number) => {
            line.forEach((value: number, xCoordinate) => {
                let fill = true;
                ctx.fillStyle = this.levelsInfo[1].colors[value];
                value == 0 ? (fill = false) : (fill = true);
                ctx.strokeStyle = value == 0 ? '#00000080' : '#000000';
                // ctx.strokeStyle=this.levelsInfo[this.gameBoard.level].colors[value]
                roundRect(ctx, xCoordinate * this.settings.boxWidth + 2, yCoordinate * this.settings.boxWidth + 2, 16, 16, 2, fill, true);
            });
        });
        ctx.closePath();
    }

    public drawUsedShapes(): void {
        const canvases = this.usedShapesRef.nativeElement.querySelectorAll('canvas');

        canvases.forEach((canvas, index) => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            let shape = JSON.parse(this.scoreInformation.usedShapes)[index];
            canvas.height = shape.length * this.settings.boxWidth;
            canvas.width = shape[0].length * this.settings.boxWidth;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 1;
            ctx.beginPath();
            shape.forEach((line: number[], yCoordinate: number) => {
                line.forEach((value: number, xCoordinate) => {
                    let fill = true;
                    ctx.fillStyle = this.levelsInfo[1].colors[value];
                    value == 0 ? (fill = false) : (fill = true);
                    ctx.strokeStyle = value == 0 ? '#00000080' : '#000000';
                    // ctx.strokeStyle=this.levelsInfo[this.gameBoard.level].colors[value]
                    roundRect(ctx, xCoordinate * this.settings.boxWidth + 2, yCoordinate * this.settings.boxWidth + 2, 16, 16, 2, fill, fill);
                });
            });
            ctx.closePath();
        });
    }
}
