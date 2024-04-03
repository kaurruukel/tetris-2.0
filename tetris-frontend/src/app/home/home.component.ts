import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    constructor(
        public appService: AppService,
        public router: Router
    ) {
        this.appService.backgroundColor = '#F4EBD0';
        this.appService.toggleLoading(false);
    }

    menuItems: { heading: string; route: string; color: string; fontColor: string; svgSource: string }[] = [
        {
            heading: 'Play',
            route: '/play',
            color: '#C5CDD8',
            fontColor: 'black',
            svgSource: 'assets/play.svg',
        },
        {
            heading: 'Leaderboard',
            route: '/leaderboard',
            color: '#E5D283',
            fontColor: 'black',
            svgSource: 'assets/leaderboard.svg',
        },
        {
            heading: 'Shapes',
            route: '/shapes',
            color: '#BFB47A',
            fontColor: 'black',
            svgSource: 'assets/shapes.svg',
        },
        {
            heading: 'Options',
            route: './options/false',
            color: '#F26052',
            fontColor: 'black',
            svgSource: 'assets/options.svg',
        },
        {
            heading: 'Account',
            route: '/account',
            color: '#F2DEDC',
            fontColor: 'black',
            svgSource: 'assets/account.svg',
        },
    ];

    clicked: boolean = false;

    public navigate(color: string, route: string): void {
        this.clicked = true;
        this.appService.backgroundColor = color;
        setTimeout(
            () => {
                this.appService.toggleLoading(true);
                this.router.navigate([route]);
            },
            this.menuItems.length * 50 + 300
        );
    }
}
