import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss'],
    animations: [
        trigger('toggleOnOff', [
            state(
                'on',
                style({
                    marginLeft: 0,
                })
            ),
            state(
                'off',
                style({
                    marginRight: 0,
                })
            ),
            transition('on => off, off => on', [animate('0.1s linear')]),
        ]),
    ],
})
export class OptionsComponent implements OnInit {
    constructor(
        public readonly appService: AppService,
        public router: Router,
        public route: ActivatedRoute
    ) {
        this.appService.toggleLoading(false);
        this.appService.backgroundColor = '#F26052';
    }
    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            if (params['inGame'] === 'true') {
                this.returnToGame = true;
            }
        });
    }

    @ViewChild('controls') changeControlDiv!: ElementRef<HTMLDivElement>;

    public returnToGame: boolean = false;

    public changeControlView: boolean = false;

    public showInfo: boolean = false;

    public controlToChange: 'rotateLeft' | 'rotateRight' | 'hardDrop' = 'rotateLeft';

    public prepareKeyValueForUI(keyCode: string): string {
        if (keyCode.substring(0, keyCode.length - 1) == 'Key') {
            return keyCode.substring(keyCode.length - 1, keyCode.length);
        }

        return keyCode;
    }

    public showChangeControl(controlToChange: 'rotateLeft' | 'rotateRight' | 'hardDrop'): void {
        this.changeControlView = true;
        this.controlToChange = controlToChange;

        document.addEventListener('keydown', this.handleKeydown);
    }

    public handleKeydown = (event: KeyboardEvent): void => {
        this.appService.userConfiguratableSettings[this.controlToChange] = event['code'];

        document.removeEventListener('keydown', this.handleKeydown);
        this.changeControlView = false;

        sessionStorage.setItem('controls', JSON.stringify(this.appService.userConfiguratableSettings));
    };

    public back() {
        // if this.
        if (this.returnToGame) {
            this.router.navigate(['play']);
        } else {
            this.router.navigate(['home']);
        }
    }
}
