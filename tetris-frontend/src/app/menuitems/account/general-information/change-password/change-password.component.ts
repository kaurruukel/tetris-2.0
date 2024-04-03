import { Component } from '@angular/core';
import { ApiService } from '../../../../api.service';
import { AppService } from '../../../../app.service';
import { FormInputs } from '../../../../static/form/interfaces/form.inputs.interface';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
    constructor(
        private apiService: ApiService,
        private appService: AppService
    ) {}

    public error: string = '';

    public success: boolean = false;

    public inputsObject: FormInputs = {
        inputs: [
            {
                name: 'password',
                uiValue: 'password',
                placeholder: 'New password',
                requirements: {
                    required: true,
                },
                isPassword: true,
                hasToBeMatchedBy: 'password2',
            },
            {
                name: 'password2',
                uiValue: 'This field',
                placeholder: 'Repeat password',
                requirements: {
                    required: true,
                },
                isPassword: true,
                hasToMatch: 'password',
            },
        ],
    };

    public submit(dto: { [key: string]: string }): void {
        this.appService.toggleLoading(true);
        this.apiService.resetPassword(dto['password']).subscribe({
            error: (e) => {
                this.error = e.message;
                this.error = e.error.message == 'ThrottlerException: Too Many Requests' ? 'Please wait before making a new request' : e.error.message;
                this.appService.toggleLoading(false);
            },
            next: () => {
                this.success = true;
                this.appService.toggleLoading(false);
            },
        });
    }
}
