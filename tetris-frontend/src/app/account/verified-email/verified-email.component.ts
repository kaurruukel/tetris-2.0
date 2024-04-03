import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { AppService } from '../../app.service';

@Component({
    selector: 'app-verified-email',
    templateUrl: './verified-email.component.html',
    styleUrls: ['./verified-email.component.scss'],
})
export class VerifiedEmailComponent {
    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService,
        public appService: AppService
    ) {
        try {
            this.appService.loading = true;
            this.uuid = this.route.snapshot.params['uuid'];
            this.verifyEmail();
        } catch (error) {}
    }

    uuid?: string;
    error: boolean = true;

    private verifyEmail(): void {
        if (this.uuid) {
            this.apiService.verifyEmail(this.uuid).subscribe({
                error: () => {
                    this.appService.toggleLoading(false);
                    this.error = true;
                },
                next: () => {
                    this.appService.toggleLoading(false);
                    this.error = false;
                },
            });
        }
    }
}
