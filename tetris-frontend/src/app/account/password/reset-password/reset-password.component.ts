import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../api.service';
import { AppService } from '../../../app.service';
import { FormInputs } from '../../../static/form/interfaces/form.inputs.interface';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService,
        public appService: AppService
    ) {
        this.appService.setToken(this.route.snapshot.params['auth-token']);
        this.appService.toggleLoading(false);
    }

    formInputs: FormInputs = {
        inputs: [
            {
                name: 'password',
                uiValue: 'Password',
                placeholder: 'Password',
                isPassword: true,
                requirements: {
                    required: true,
                },
                hasToBeMatchedBy: 'password2',
            },
            {
                name: 'password2',
                uiValue: 'This field',
                placeholder: 'Repeat password',
                isPassword: true,
                requirements: {
                    required: true,
                },
                hasToMatch: 'password',
            },
        ],
    };

    error: string = '';

    successful: boolean = false;

    public submit(event: { [key: string]: string }): void {
        this.appService.toggleLoading(true);
        this.apiService.resetPassword(event['password']).subscribe({
            error: () => {
                this.error = 'Something went wrong :/ ';
                this.appService.toggleLoading(false);
            },
            next: () => {
                this.successful = true;
                this.appService.toggleLoading(false);
            },
        });
    }
}
