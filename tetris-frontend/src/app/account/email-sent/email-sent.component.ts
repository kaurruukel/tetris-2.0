import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { AppService } from '../../app.service';

@Component({
    selector: 'app-email-sent',
    templateUrl: './email-sent.component.html',
    styleUrls: ['./email-sent.component.scss'],
})
export class EmailSentComponent {
    constructor(
        private router: Router,
        private apiService: ApiService,
        public appService: AppService
    ) {
        this.name = this.router.getCurrentNavigation()?.extras?.state?.['name'];
        this.email = this.router.getCurrentNavigation()?.extras?.state?.['email'];
        this.appService.toggleLoading(false);
    }
    name: string;
    email: string;

    resent: boolean = false;

    emailSentTime?: number;

    errorMessage: string = '';

    public async resendEmail(): Promise<void> {
        if (!this.emailSentTime || this.validForResend()) {
            this.emailSentTime = Date.now();
            this.resent = true;
            this.appService.toggleLoading(true);

            this.apiService.resendEmail(this.name).subscribe({
                error: (e) => {
                    this.errorMessage = e.error.message;
                },
                next: () => {
                    this.appService.toggleLoading(false);
                },
            });
            return;
        }
        this.errorMessage = 'Please wait a little before we can send you a new email.';
    }

    public validForResend(): boolean {
        if (this.emailSentTime && Date.now() - this.emailSentTime > 3 * 60 * 1000) {
            return true;
        }
        return false;
    }
}
