import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
    selector: 'app-loading-screen',
    templateUrl: './loading-screen.component.html',
    styleUrls: ['./loading-screen.component.scss'],
    animations: [
        trigger('shrinkNormal', [
            state('normal', style({})),
            state(
                'shrink',
                style({
                    scale: 0,
                })
            ),
            transition('normal => shrink', [animate('1s')]),
        ]),
    ],
})
export class LoadingScreenComponent {
    constructor(public appService: AppService) {}
    open: boolean = true;
}
