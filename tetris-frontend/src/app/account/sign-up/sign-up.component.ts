import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { FormInputs } from '../../static/form/interfaces/form.inputs.interface';
import { SignUpCredentials } from '../../interfaces/sign-up-credentials.interface';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
    constructor(
        private apiService: ApiService,
        private router: Router,
        public appService: AppService
    ) {
        this.appService.toggleLoading(false);
        this.appService.backgroundColor = '#F4EBD0';
    }

    inputsObject: FormInputs = {
        inputs: [
            {
                name: 'name',
                placeholder: 'Username',
                uiValue: 'Username',
                requirements: { required: true },
                isPassword: false,
            },
            {
                name: 'email',
                placeholder: 'Email',
                uiValue: 'Email',
                requirements: {
                    required: true,
                    isEmail: true,
                },
                isPassword: false,
            },
            {
                name: 'password',
                placeholder: 'Password',
                uiValue: 'Password',
                requirements: { required: true },
                isPassword: true,
                hasToBeMatchedBy: 'password2',
            },
            {
                name: 'password2',
                placeholder: 'Repeat password',
                uiValue: '',
                requirements: {
                    required: false,
                    minLength: 0,
                    maxLength: null,
                    isEmail: false,
                },
                isPassword: true,
                hasToMatch: 'password',
            },
        ],
    };

    credentials: SignUpCredentials = {
        name: '',
        email: '',
        password: '',
    };

    errorMessage: string = '';

    public onSubmit(event: { [key: string]: string }): void {
        this.credentials = {
            name: event['name'],
            email: event['email'],
            password: event['password'],
        };
        this.appService.toggleLoading(true);
        this.apiService.signUp(this.credentials).subscribe({
            // TODO: trycatch in async func
            error: (e) => {
                this.errorMessage = e.error.message;
                this.appService.toggleLoading(false);
            },
            next: () => {
                this.router.navigate(['email-sent'], {
                    state: {
                        name: this.credentials.name,
                        email: this.credentials.email,
                    },
                });
            },
        });
    }
}
