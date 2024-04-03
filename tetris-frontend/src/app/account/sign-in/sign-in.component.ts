import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { FormInputs } from '../../static/form/interfaces/form.inputs.interface';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    animations: [
        trigger('focusUnfocus', [
            state(
                'focus',
                style({
                    padding: '10px',
                    fontSize: '12px',
                })
            ),
            state(
                'unFocus',
                style({
                    padding: '10px',
                })
            ),
            transition('focus => unFocus, unFocus => focus', [animate('0.1s')]),
        ]),
    ],
})
export class SignInComponent {
    constructor(
        private apiService: ApiService,
        public appService: AppService,
        private router: Router
    ) {
        this.appService.toggleLoading(false);
        this.appService.backgroundColor = 'white';
    }
    inputsObject: FormInputs = {
        inputs: [
            {
                name: 'email',
                placeholder: 'Email',
                uiValue: 'Email',
                requirements: {
                    required: false,
                    minLength: 0,
                },
                isPassword: false,
            },
            {
                name: 'password',
                placeholder: 'Password',
                uiValue: 'Password',
                requirements: {
                    required: false,
                    minLength: 0,
                },
                isPassword: true,
            },
        ],
    };


    credentials: { email: string; password: string } = {
        email: '',
        password: '',
    };

    errorMessage: string = '';

    public onSubmit(event: { [key: string]: string }): void {
        this.credentials = event as { email: string; password: string };
        this.appService.loading = true;
        this.apiService.signIn(this.credentials).subscribe({
            error: (e) => {
                this.errorMessage = e.error.message;
                this.appService.toggleLoading(false);
            },
            next: (res) => {
                this.loggedIn(res);
            },
        });
    }

    private loggedIn(res: { access_token: string }): void {
        sessionStorage.setItem('access_token', res.access_token);
        this.router.navigate(['home']);
    }
}
