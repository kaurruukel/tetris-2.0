import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AppService } from '../app.service';
import { jwtResponse } from '../interfaces/jwt-response.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private router: Router,
        private appService: AppService
    ) {}

    private tokenExpired(token: string): boolean {
        const expiry = JSON.parse(atob(token.split('.')[1])).exp;
        return Math.floor(new Date().getTime() / 1000) >= expiry;
    }

    public isAuthenticated(): boolean {
        const token = sessionStorage.getItem('access_token');
        if (!token || this.tokenExpired(token)) return false;
        const payload = jwtDecode(token) as jwtResponse;
        this.appService.user = {
            email: payload.email,
            name: payload.name,
            uuid: payload.uuid,
        };

        return true;
    }

    public navigateToSignIn(): void {
        this.router.navigate(['sign-in']);
    }
}
