import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';

@Component({
    selector: 'app-shapes',
    templateUrl: './shapes.component.html',
    styleUrls: ['./shapes.component.scss'],
    animations: [
        trigger('selectUnSelect', [
            state(
                'select',
                style({
                    scale: '0.8',
                    opacity: 0.7,
                })
            ),
            state(
                'unSelect',
                style({
                    scale: '1',
                    opacity: 1,
                })
            ),
            transition('select => unSelect, unSelect => select', [animate('0.1s')]),
        ]),
    ],
})
export class ShapesComponent implements AfterViewInit {
    constructor(
        private appService: AppService,
        public router: Router
    ) {
        this.appService.toggleLoading(false);
        this.appService.backgroundColor = '#BFB47A';

        this.appService.getUserShapesFromSessionStorage();
    }
    ngAfterViewInit(): void {
        if (!this.shapesLoaded) {
            this.initGrids();
            setTimeout(() => {
                this.drawShapes();
            }, 300);
        }
    }

    @ViewChild('gridsContainer') gridsContainer!: ElementRef<HTMLCanvasElement>;

    private shapesLoaded: boolean = false;

    public svgs: { [key: string]: boolean } = {
        svg0: false,
        svg1: false,
        svg2: false,
        svg3: false,
        svg4: false,
        svg5: false,
        svg6: false,
    };

    private selectedSvgs: string[] = [];

    public showInfo: boolean = false;

    private initGrids(): void {
        for (let i = 0; i < 2; i++) {
            this.appService.userShapes.shapes[i].shape.forEach((row, yCoordinate) => {
                row.forEach((value, xCoordinate) => {
                    let newdiv = document.createElement('div');
                    newdiv.setAttribute('id', 'box-' + yCoordinate + '-' + xCoordinate);
                    newdiv.setAttribute('class', 'grid-' + i);
                    newdiv.style.cssText = 'border: 1px solid black; border-radius: 4px; height: 25%; width: 25%; transition-duration: 300ms;';
                    newdiv.addEventListener('click', (e) => {
                        this.handleClick(e);
                    });
                    this.gridsContainer.nativeElement.querySelectorAll('.grid')[i].appendChild(newdiv);
                });
            });
        }
        this.shapesLoaded = true;
    }

    private handleClick(event: MouseEvent): void {
        let div = event.target as HTMLDivElement;
        let classlist = div.classList;
        let yCoordinate = div.id.split('-')[1] as unknown as number;
        let xCoordinate = div.id.split('-')[2] as unknown as number;
        if (classlist.contains('active')) {
            div.style.backgroundColor = '';
            div.style.boxShadow = '';
            classlist.remove('active');
            classlist.contains('grid-0') ? (this.appService.userShapes.shapes[0].shape[yCoordinate][xCoordinate] = 0) : '';
            classlist.contains('grid-1') ? (this.appService.userShapes.shapes[1].shape[yCoordinate][xCoordinate] = 0) : '';
        } else {
            classlist.add('active');
            div.style.backgroundColor = '#69b7a09c';
            div.style.boxShadow = '10px 10px 40px 0px rgba(0,0,0,0.4)';
            classlist.contains('grid-0') ? (this.appService.userShapes.shapes[0].shape[yCoordinate][xCoordinate] = 1) : '';

            classlist.contains('grid-1') ? (this.appService.userShapes.shapes[1].shape[yCoordinate][xCoordinate] = 1) : '';
        }

        this.saveToSessionStorage();
    }

    public toggleChoice(svg: string): void {
        if (this.selectedSvgs.includes(svg)) {
            this.selectedSvgs.splice(this.selectedSvgs.indexOf(svg), 1);
        } else {
            this.selectedSvgs.push(svg);
        }
        if (this.selectedSvgs.length > 2) {
            this.selectedSvgs.splice(0, 1);
        }

        Object.keys(this.svgs).forEach((localSvg) => {
            this.svgs[localSvg] = this.selectedSvgs.includes(localSvg) ? true : false;
        });

        for (let i = 0; i < 2; i++) {
            this.appService.userShapes.shapes[i].shapeIndex = this.selectedSvgs[i] ? (this.selectedSvgs[i].charAt(svg.length - 1) as unknown as number) : -1;
        }

        this.saveToSessionStorage();
    }

    private drawShapes(): void {
        this.appService.userShapes.shapes.forEach((shapeInfo, index) => {
            let shape = shapeInfo.shape;

            shape.forEach((row, yCoordinate) => {
                row.forEach((value, xCoordinate) => {
                    if (value == 1) {
                        var div = this.gridsContainer.nativeElement.querySelectorAll('.grid')[index].querySelector('#box-' + yCoordinate + '-' + xCoordinate) as HTMLDivElement;
                        div.style.backgroundColor = '#69b7a09c';
                        div.style.boxShadow = '10px 10px 40px 0px rgba(0,0,0,0.4)';
                        div.classList.add('active');
                    }
                });
            });

            if (shapeInfo.shapeIndex !== -1) {
                this.svgs['svg' + shapeInfo.shapeIndex] = true;
                this.selectedSvgs.push('svg' + shapeInfo.shapeIndex);
            }
        });
    }

    private saveToSessionStorage(): void {
        sessionStorage.setItem('tetris-shapes', JSON.stringify(this.appService.userShapes));
    }
}
