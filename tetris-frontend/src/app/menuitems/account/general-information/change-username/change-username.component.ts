import { Component } from '@angular/core';
import { ApiService } from '../../../../api.service';
import { AppService } from '../../../../app.service';
import { FormInputs } from '../../../../static/form/interfaces/form.inputs.interface';

@Component({
    selector: 'app-change-username',
    templateUrl: './change-username.component.html',
    styleUrls: ['./change-username.component.scss'],
})
export class ChangeUsernameComponent {
    constructor(
        private apiService: ApiService,
        private appService: AppService
    ) {}

    inputsObject: FormInputs = {
        inputs: [
            {
                name: 'name',
                placeholder: 'new username',
                uiValue: 'Username',
                requirements: {
                    required: true,
                    isEmail: false,
                },
                isPassword: false,
            },
        ],
    };

    public error: string = '';

    public success: boolean = false;

    public submit(dto: { [key: string]: string }): void {
        this.appService.toggleLoading(true);
        this.apiService.newEmailOrUsername(dto).subscribe({
            error: (e) => {
                this.error = e.error.message == 'ThrottlerException: Too Many Requests' ? 'Please wait before making a new request' : e.error.message;
                this.appService.toggleLoading(false);
            },
            next: (obj) => {
                this.success = true;
                this.appService.toggleLoading(false);
                this.appService.setToken(obj['token']);
            },
        });
    }
}
