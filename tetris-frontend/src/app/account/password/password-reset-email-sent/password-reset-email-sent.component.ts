import { Component } from '@angular/core';
import { AppService } from '../../../app.service';

@Component({
    selector: 'app-password-reset-email-sent',
    templateUrl: './password-reset-email-sent.component.html',
    styleUrls: ['./password-reset-email-sent.component.scss'],
})
export class PasswordResetEmailSentComponent {
    constructor(public appService: AppService) {
        this.appService.toggleLoading(false);
    }
}
