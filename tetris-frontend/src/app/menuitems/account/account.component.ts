import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { MenuItem, MenuItems } from './interfaces/menuItems.interface';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
    constructor(
        public appService: AppService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.appService.toggleLoading(false);
        this.appService.backgroundColor = '#F2DEDC';
    }

    menuItems: MenuItems = [
        {
            heading: 'General information',
            path: 'general-information',
            color: '#A0B9D9',
            active: true,
        },
        {
            heading: 'Sign out',
            path: 'sign-out',
            color: '#8D9AA6',
            active: false,
        },
        {
            heading: 'Back',
            path: 'home',
            color: '#BABDBF',
            active: false,
        },
    ];

    public navigate(item: MenuItem): void {
        this.menuItems.forEach((i: MenuItem) => {
            i.active = false;
        });
        item.active = true;

        if (item.path == 'home') {
            this.router.navigate(['home']);
            return;
        }
        this.router.navigate([item.path], {
            relativeTo: this.route,
        });
    }
}
