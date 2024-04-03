import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../../app.service';

@Component({
    selector: 'app-general-information',
    templateUrl: './general-information.component.html',
    styleUrls: ['./general-information.component.scss'],
})
export class GeneralInformationComponent {
    constructor(
        public appService: AppService,
        private router: Router
    ) {}

    public navigate(route: string): void {
        this.router.navigate(['account/' + route]);
    }
}
