import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { jwtResponse } from './interfaces/jwt-response.interface';
import { UserConfiguratableSettings } from './interfaces/user-configuratable-settings.interface';
import { User } from './interfaces/user.interface';
import { UserShapes } from './menuitems/play/interfaces/user-shape.interface';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    constructor(private router: Router) {
        this.getControlsFromSessionStorage();
    }

    user: User = {
        name: '',
        uuid: '',
        email: '',
    };

    loading: boolean = false;

    backgroundColor!: string;

    private getControlsFromSessionStorage(): void {
        const storage = sessionStorage.getItem('controls');
        if (storage) {
            this.userConfiguratableSettings = JSON.parse(storage);
        }
    }

    public userConfiguratableSettings: UserConfiguratableSettings = {
        pieceShadow: true,
        rotateLeft: 'KeyX',
        rotateRight: 'KeyC',
        hardDrop: 'Space',
    };

    public toggleLoading(boolean: boolean): void {
        if (boolean) {
            this.loading = true;
        } else {
            setTimeout(() => {
                this.loading = false;
            }, 600);
        }
    }

    public setToken(token: string): void {
        sessionStorage.setItem('access_token', token);
        this.loadTokenPayload();
    }

    public retrieveTokenFromStorage(): string | null {
        return sessionStorage.getItem('access_token');
    }

    public loadTokenPayload(): void {
        const token = sessionStorage.getItem('access_token');
        if (!token) return;
        const payload = jwtDecode(token) as jwtResponse;
        this.user = {
            email: payload.email,
            name: payload.name,
            uuid: payload.uuid,
        };
    }

    public logOut(): void {
        this.toggleLoading(true);
        sessionStorage.setItem('access_token', '');
        this.router.navigate(['sign-in']);
    }

    public userShapes: UserShapes = {
        shapes: [
            {
                shapeIndex: -1,
                shape: [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
            },
            {
                shapeIndex: -1,
                shape: [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
            },
        ],
    };

    public getUserShapesFromSessionStorage(): void {
        try {
            const storage = sessionStorage.getItem('tetris-shapes');
            if (storage) {
                this.userShapes = JSON.parse(storage);
            }
        } catch (error) {}
    }
}
