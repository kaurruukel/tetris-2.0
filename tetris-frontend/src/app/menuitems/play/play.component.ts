import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { AppService } from '../../app.service';
import { defaultShapes } from './constants/default-shapes';
import { gameState } from './constants/game-state';
import { levelsInfo } from './constants/levels-info';
import { movementsToTry } from './constants/movements-to-try-on-rotation';
import { roundRect } from './helpers/round-rect';
import { FallingPiece } from './interfaces/falling-piece.interface';
import { GameBoard } from './interfaces/game-board.interface';
import { GameSettings } from './interfaces/game-settings.interface';
import { LevelsInfo } from './interfaces/levels-info.interface';
import { Scoring } from './interfaces/scoring.interface';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements AfterViewInit {
    constructor(
        private appService: AppService,
        private apiService: ApiService,
        public router: Router
    ) {
        this.appService.backgroundColor = '#C5CDD8';
        this.appService.toggleLoading(false);
        this.gameState = structuredClone(gameState);
        this.gameShapes = structuredClone(defaultShapes);
        this.levelsInfo = levelsInfo;
        this.settings.boxShadow = this.appService.userConfiguratableSettings.pieceShadow;
    }
    ngAfterViewInit(): void {
        this.initGameBoard();
    }

    @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('shapeCanvas') upcomingShapeCanvas!: ElementRef<HTMLCanvasElement>;

    private ctx!: CanvasRenderingContext2D;
    private upcomingShapeCtx!: CanvasRenderingContext2D;

    public isGamePaused: boolean = false;

    public gameOver: boolean = false;

    private levelsInfo: LevelsInfo;

    private settings: GameSettings = {
        boxWidth: 30,
        boxShadow: false,
        currentDropSpeed: 1000,
        defaultDropSpeed: 1000,
        fastDropingSpeed: 100,
    };

    public gameBoard: GameBoard = {
        score: 0,
        shapes: [],
        level: 1,
        linesToNextLevel: 20,
    };

    private scoring: Scoring = {
        1: 100,
        2: 300,
        3: 500,
        4: 800,
    };

    public upcomingShapes: number[][][] = [];

    private fallingPiece!: FallingPiece;

    private gameState: number[][];

    private gameShapes: number[][][];

    private initGameBoard(): void {
        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        this.ctx = ctx;
        canvas.height = this.gameState.length * this.settings.boxWidth;
        canvas.width = this.gameState[0].length * this.settings.boxWidth;
        this.drawGameState();

        this.generateUpcomingShapesOrShape();

        ///
        this.startGame();
        ///
    }

    private drawGameState(): void {
        this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

        if (this.fallingPiece) {
            this.mapOrDeMapFallingPiece(false);
            this.mapShadow();
            this.mapOrDeMapFallingPiece(true);
            this.fallingPiece.shadowCoordinates.forEach((coordinates) => {
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 3;
                roundRect(this.ctx, coordinates[0] * this.settings.boxWidth + 3, coordinates[1] * this.settings.boxWidth + 3, 25, 25, 2, true, true);
            });
        }
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.gameState.forEach((line: number[], yCoordinate) => {
            line.forEach((value: number, xCoordinate) => {
                this.ctx.fillStyle = this.levelsInfo[this.gameBoard.level].colors[value];
                this.ctx.strokeStyle = value == 0 ? '#00000080' : '#000000';
                if (this.fallingPiece && !this.fallingPiece.colorIndex && value !== 0) this.fallingPiece.colorIndex = value;
                roundRect(this.ctx, xCoordinate * this.settings.boxWidth + 3, yCoordinate * this.settings.boxWidth + 3, 25, 25, 2, true, true);
            });
        });
        this.ctx.closePath();
    }

    private mapShadow(): void {
        if (!this.settings.boxShadow || !this.fallingPiece) return;

        this.fallingPiece.shadowCoordinates = [];

        var yCoordinate = this.fallingPiece.yCoordinate;

        while (
            !this.isFallingPieceColliding({
                ...this.fallingPiece,
                yCoordinate: yCoordinate,
            })
        ) {
            yCoordinate++;
        }

        yCoordinate--;

        this.fallingPiece.piece.forEach((row, yCoordinateShape) => {
            row.forEach((value: number, xCoordinate: number) => {
                if (value != 0) {
                    this.fallingPiece.shadowCoordinates.push([xCoordinate + this.fallingPiece.xCoordinate, yCoordinate + yCoordinateShape]);
                }
                // this.gameState[yCoordinateShape + yCoordinate][xCoordinate + this.fallingPiece.xCoordinate] = -1
            });
        });
    }

    private generateUpcomingShapesOrShape(): void {
        this.upcomingShapes.push(this.gameShapes[Math.floor(Math.random() * 7)]);
    }

    private drawUpcoming(shape: number[][]): void {
        if (!this.upcomingShapeCtx) {
            let canvas = this.upcomingShapeCanvas.nativeElement;
            let ctx = canvas.getContext('2d');
            if (ctx) {
                this.upcomingShapeCtx = ctx;
            }
        }

        shape = this.removeEmptyColumnsAndRows(shape);
        this.upcomingShapeCanvas.nativeElement.height = shape.length * this.settings.boxWidth;
        this.upcomingShapeCanvas.nativeElement.width = shape[0].length * this.settings.boxWidth;

        shape.forEach((row, yCoordinate) => {
            row.forEach((value: number, xCoordinate: number) => {
                if (value != 0) {
                    this.upcomingShapeCtx.fillStyle = this.levelsInfo[this.gameBoard.level].colors[value];
                    roundRect(this.upcomingShapeCtx, xCoordinate * this.settings.boxWidth + 3, yCoordinate * this.settings.boxWidth + 3, 25, 25, 2, true, true);
                }
            });
        });
    }

    private gameTickInterval!: ReturnType<typeof setTimeout>;

    public startGame(): void {
        this.loadUserShapes();

        this.gameOver = false;
        this.gameState = structuredClone(gameState);

        this.gameBoard = {
            score: 0,
            shapes: this.gameShapes,
            level: 1, // start at level 1,
            linesToNextLevel: 1,
        };

        this.newPiece();
        this.startGameTick();
    }

    private loadUserShapes(): void {
        this.appService.userShapes.shapes.forEach((shapeInfo) => {
            if (shapeInfo.shapeIndex > -1) {
                const hasShapeBeenDrawn = shapeInfo.shape.some((row) => row.includes(1));

                if (!hasShapeBeenDrawn) return;

                this.gameShapes[shapeInfo.shapeIndex] = this.removeEmptyColumnsAndRows(structuredClone(shapeInfo.shape));
            }
        });
    }

    public startGameTick(): void {
        this.isGamePaused = false;
        this.gameTickInterval = setInterval(() => {
            if (this.gameOver || this.isGamePaused) return;

            this.dropPiece();
        }, this.levelsInfo[this.gameBoard.level].tickSpeed);
    }

    public pauseGame(): void {
        clearInterval(this.gameTickInterval);
        clearInterval(this.movingLeftInterval);
        clearInterval(this.movingRightInterval);
        clearInterval(this.fastDroppingInterval);
        this.isGamePaused = true;
    }

    private newPiece(): void {
        let newPiece = this.upcomingShapes.pop();
        if (!newPiece) return;
        this.fallingPiece = {
            piece: newPiece,
            xCoordinate: 4,
            yCoordinate: 0,
            shadowCoordinates: [[]],
            colorIndex: 0,
        };
        this.generateUpcomingShapesOrShape();
        this.drawUpcoming(structuredClone(this.upcomingShapes[0]));
        if (this.isFallingPieceColliding(this.fallingPiece)) {
            this.endGame();
        }
        this.mapOrDeMapFallingPiece(true);
        this.drawGameState();
    }

    private mapOrDeMapFallingPiece(ontoGameBoard: boolean): void {
        const piece = this.fallingPiece.piece;

        piece.forEach((row, yCoordinate) => {
            row.forEach((value: number, xCoordinate: number) => {
                if (value == 0) return;
                this.gameState[yCoordinate + this.fallingPiece.yCoordinate][xCoordinate + this.fallingPiece.xCoordinate] = ontoGameBoard ? value : 0;
            });
        });
    }

    private dropPiece(): boolean {
        this.mapOrDeMapFallingPiece(false);
        this.fallingPiece.yCoordinate++;
        const isColliding = this.isFallingPieceColliding(this.fallingPiece);
        if (!isColliding) {
            this.mapOrDeMapFallingPiece(true);
            this.drawGameState();
            return true;
        } else {
            this.fallingPiece.yCoordinate--;
            this.mapOrDeMapFallingPiece(true);
            this.checkForCompletedLines();
            this.newPiece();
            return false;
        }
    }

    private isFallingPieceColliding(fallingPiece: FallingPiece): boolean {
        const piece = fallingPiece.piece;

        var colliding = false;
        piece.forEach((row, yCoordinate) => {
            row.forEach((value: number, xCoordinate: number) => {
                if (value == 0) return;
                if (this.gameState.length <= fallingPiece.yCoordinate + yCoordinate) {
                    colliding = true;
                    return;
                }

                if (this.gameState[0].length <= fallingPiece.xCoordinate + xCoordinate) {
                    colliding = true;
                    return;
                }

                if (this.gameState[yCoordinate + fallingPiece.yCoordinate][xCoordinate + fallingPiece.xCoordinate] !== 0) {
                    colliding = true;
                }
            });
        });
        return colliding;
    }

    private checkForCompletedLines(): void {
        let combo = 0;
        this.gameState.forEach((line, yCoordinate) => {
            let newRow: number[] = [];
            this.gameState[0].forEach(() => {
                newRow.push(0);
            });
            let rowComplete = true;
            line.forEach((value: number) => {
                if (value == 0) rowComplete = false;
            });

            if (rowComplete) {
                this.gameState.splice(yCoordinate, 1);
                this.gameState.unshift(newRow);
                combo++;
            }
        });
        if (combo > 4 || combo < 1) return;

        this.updateScore(combo as 1 | 2 | 3 | 4);
    }

    private updateScore(combo: 1 | 2 | 3 | 4): void {
        this.gameBoard.score += this.scoring[combo] * this.gameBoard.level;

        this.gameBoard.linesToNextLevel -= combo == 4 ? 8 : combo;

        // we have 12 levels
        if (this.gameBoard.linesToNextLevel < 1 && this.gameBoard.level < 12) {
            this.gameBoard.level++;
            this.gameBoard.linesToNextLevel = 20 + this.gameBoard.linesToNextLevel;
        }
    }

    private removeEmptyColumnsAndRows(shape: number[][]): number[][] {
        if (!shape) return [[]];
        let changed = false;
        let firstRow = shape[0];
        let lastRow = shape[shape.length - 1];
        let firstColumn = shape.map((row) => {
            return row[0];
        });
        let lastColumn = shape.map((row) => {
            return row[row.length - 1];
        });

        if (firstRow.every((value) => value === 0)) {
            changed = true;
            shape.splice(0, 1);
        }
        if (lastRow.every((value) => value === 0)) {
            changed = true;
            shape.pop();
        }
        if (firstColumn.every((value) => value === 0)) {
            changed = true;
            shape.map((value) => {
                return value.splice(0, 1);
            });
        }
        if (lastColumn.every((value) => value === 0)) {
            changed = true;
            shape.map((value) => {
                return value.pop();
            });
        }

        if (changed) {
            shape = this.removeEmptyColumnsAndRows(shape);
        }

        return shape;
    }

    public endGame(): void {
        clearInterval(this.gameTickInterval);
        clearInterval(this.movingLeftInterval);
        clearInterval(this.movingRightInterval);
        clearInterval(this.fastDroppingInterval);

        // we want to return the used shapes in as small a matrix as possible

        let shapesToReturn: number[][][] = [];
        this.gameShapes.forEach((shape) => {
            shapesToReturn.push(this.removeEmptyColumnsAndRows(shape));
        });

        this.apiService
            .newScore({
                score: this.gameBoard.score,
                level: this.gameBoard.level,
                endGameState: JSON.stringify(this.gameState),
                usedShapes: JSON.stringify(shapesToReturn),
            })
            .subscribe({
                error: (e) => console.log(e),
                next: () => {},
            });
        this.gameOver = true;
    }

    /**
     *
     *
     * USER INPUTS
     *
     *
     */

    /**
     * Intervals
     */
    private fastDroppingInterval: ReturnType<typeof setTimeout> | undefined;
    private movingLeftInterval: ReturnType<typeof setTimeout> | undefined;
    private movingRightInterval: ReturnType<typeof setTimeout> | undefined;

    @HostListener('document:keydown', ['$event'])
    handleKeyDownEvent(event: KeyboardEvent): void {
        if (!this.fallingPiece || this.isGamePaused || this.gameOver) return;

        if (event.key == 'ArrowRight') {
            if (!this.movingRightInterval) {
                this.moveRight();
                this.movingRightInterval = setInterval(() => {
                    if (this.movingLeftInterval) return;
                    this.moveRight();
                }, 100);
            }
        } else if (event.key == 'ArrowLeft') {
            if (!this.movingLeftInterval) {
                this.moveLeft();
                this.movingLeftInterval = setInterval(() => {
                    if (this.movingRightInterval) return;
                    this.moveLeft();
                }, 100);
            }
        } else if (event.key == 'ArrowDown') {
            if (!this.fastDroppingInterval) {
                this.mapOrDeMapFallingPiece(false);
                this.fastDroppingInterval = setInterval(() => {
                    this.dropPiece();
                    this.drawGameState();
                }, this.settings.fastDropingSpeed);
            }
            return;
        } else if (event.key == 'ArrowUp') {
            this.rotate(true);
        } else if (event.code == this.appService.userConfiguratableSettings.hardDrop) {
            clearInterval(this.gameTickInterval);
            while (this.dropPiece()) {}
            if (!this.fallingPiece || this.isGamePaused || this.gameOver) return;

            this.startGameTick();
        } else if (event.code == this.appService.userConfiguratableSettings.rotateLeft) {
            this.rotate(false);
        } else if (event.code == this.appService.userConfiguratableSettings.rotateRight) {
            this.rotate(true);
        } else {
            return;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUpEvent(event: KeyboardEvent): void {
        if (!this.fallingPiece || this.isGamePaused || this.gameOver) return;

        if (event.key == 'ArrowDown') {
            clearInterval(this.fastDroppingInterval);
            this.fastDroppingInterval = undefined;
        } else if (event.key == 'ArrowRight') {
            clearInterval(this.movingRightInterval);
            this.movingRightInterval = undefined;
        } else if (event.key == 'ArrowLeft') {
            clearInterval(this.movingLeftInterval);
            this.movingLeftInterval = undefined;
        }
    }

    private rotate(clockwise: boolean): void {
        if (clockwise) {
            var newPiece = this.fallingPiece.piece[0].map((val: number, index: number) => this.fallingPiece.piece.map((row) => row[index]).reverse());
        } else {
            var newPiece = this.fallingPiece.piece[0].map((val: number, index: number) => this.fallingPiece.piece.map((row) => row[row.length - 1 - index]));
        }
        this.mapOrDeMapFallingPiece(false);
        if (
            !this.isFallingPieceColliding({
                ...this.fallingPiece,
                piece: newPiece,
            })
        ) {
            this.fallingPiece.piece = newPiece;
            this.mapOrDeMapFallingPiece(true);
            this.drawGameState();
        } else {
            movementsToTry.every((movement) => {
                if (
                    !this.isFallingPieceColliding({
                        ...this.fallingPiece,
                        piece: newPiece,
                        xCoordinate: this.fallingPiece.xCoordinate + movement[0],
                        yCoordinate: this.fallingPiece.yCoordinate + movement[1],
                    })
                ) {
                    this.fallingPiece.piece = newPiece;
                    this.fallingPiece = {
                        ...this.fallingPiece,
                        piece: newPiece,
                        xCoordinate: this.fallingPiece.xCoordinate + movement[0],
                        yCoordinate: this.fallingPiece.yCoordinate + movement[1],
                    };
                    this.mapOrDeMapFallingPiece(true);
                    this.drawGameState();
                    return false;
                }
                return true;
            });
        }
    }

    private moveRight(): void {
        this.mapOrDeMapFallingPiece(false);
        this.fallingPiece.xCoordinate++;
        if (this.isFallingPieceColliding(this.fallingPiece)) this.fallingPiece.xCoordinate--;
        this.mapOrDeMapFallingPiece(true);
        this.drawGameState();
    }

    private moveLeft(): void {
        this.mapOrDeMapFallingPiece(false);
        this.fallingPiece.xCoordinate--;
        if (this.isFallingPieceColliding(this.fallingPiece)) this.fallingPiece.xCoordinate++;
        this.mapOrDeMapFallingPiece(true);
        this.drawGameState();
    }
}
