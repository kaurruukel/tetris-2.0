import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { AppService } from '../../../app.service';

@Component({
    selector: 'app-sign-out',
    templateUrl: './sign-out.component.html',
    styleUrls: ['./sign-out.component.scss'],
    animations: [
        trigger('confirm', [
            state(
                'top',
                style({
                    bottom: '100%',
                    opacity: 0,
                    display: 'none',
                })
            ),
            state(
                'mid',
                style({
                    bottom: '0',
                    opacity: 1,
                })
            ),
            state(
                'bot',
                style({
                    top: '100%',
                    opacity: 0,
                    display: 'none',
                })
            ),
            transition('top => mid, mid => top, mid=> bot, bot => mid', [animate('400ms cubic-bezier(.56,-0.89,.36,2.03)')]),
        ]),
    ],
})
export class SignOutComponent {
    constructor(private appService: AppService) {}

    state: 'standBy' | 'prompt' = 'standBy';

    public signOut(): void {
        this.appService.logOut();
    }
}
