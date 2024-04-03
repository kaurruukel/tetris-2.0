import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { AppService } from '../../../app.service';
import { FormInputs } from '../../../static/form/interfaces/form.inputs.interface';

@Component({
    selector: 'app-forgot-pw',
    templateUrl: './forgot-pw.component.html',
    styleUrls: ['./forgot-pw.component.scss'],
})
export class ForgotPwComponent {
    constructor(
        private apiService: ApiService,
        public appService: AppService,
        private router: Router
    ) {
        this.appService.toggleLoading(false);
    }

    inputsObject: FormInputs = {
        inputs: [
            {
                name: 'usernameOrEmail',
                placeholder: 'Username or email',
                uiValue: 'This field',
                requirements: {
                    required: true,
                },
                isPassword: false,
            },
        ],
    };

    error: string = '';

    public async submit(event: { [key: string]: string }): Promise<void> {
        this.appService.toggleLoading(true);

        this.apiService.resetPasswordEmail(event['usernameOrEmail']).subscribe({
            error: (e) => {
                this.error = e.error.message == 'ThrottlerException: Too Many Requests' ? 'Please wait before requesting a new email' : e.error.message;
                this.appService.toggleLoading(false);
            },
            next: (res: { email: string }) => {
                this.appService.user.email = res['email'];
                this.router.navigate(['password-reset-email-sent']);
            },
        });
    }
}
