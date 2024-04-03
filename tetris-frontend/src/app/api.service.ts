import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SignInCredentials } from './interfaces/sign-in-credentials.interface';
import { environment } from '../environment/environment';
import { SignUpCredentials } from './interfaces/sign-up-credentials.interface';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { NewScoreInfo } from './static/interfaces/new-score-info.interface';
import { LeaderBoardResponse } from './menuitems/leaderboard/interfaces/leaderboard-reponse.interface';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(
        private http: HttpClient,
        private appService: AppService
    ) {}

    public signIn(signInCredentials: SignInCredentials): Observable<{ access_token: string }> {
        const body = JSON.stringify(signInCredentials);
        return this.http.post(environment.LOCAL_URL + 'auth/login', body, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }) as Observable<{ access_token: string }>;
    }

    public signUp(signUpCredentials: SignUpCredentials): Observable<Object> {
        const body = JSON.stringify(signUpCredentials);
        return this.http.post(environment.LOCAL_URL + 'users', body, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        });
    }

    public resendEmail(name: string): Observable<Object> {
        return this.http.post(
            environment.LOCAL_URL + 'users/resend-email',
            {
                name: name,
            },
            {
                headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            }
        );
    }

    public verifyEmail(uuid: string): Observable<Object> {
        return this.http.get(environment.LOCAL_URL + 'users/validate-email', {
            params: {
                uuid,
            },
        });
    }

    public resetPasswordEmail(usernameOrEmail: string): Observable<{ email: string }> {
        return this.http.post(
            environment.LOCAL_URL + 'users/send-reset-password-email',
            {
                usernameOrEmail: usernameOrEmail,
            },
            {
                headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            }
        ) as Observable<{ email: string }>;
    }

    public resetPassword(newPassword: string): Observable<Object> {
        const authToken = this.appService.retrieveTokenFromStorage();
        return this.http.post(
            environment.LOCAL_URL + 'users/reset-password',
            {
                newPassword: newPassword,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
    }

    public newEmailOrUsername(emailOrUsername: { [key: string]: string }): Observable<{ token: string }> {
        return this.http.post(
            environment.LOCAL_URL + 'users/change-username-or-email',
            {
                ...{
                    name: this.appService.user.name,
                    email: this.appService.user.email,
                },
                ...emailOrUsername,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.appService.retrieveTokenFromStorage()}`,
                },
            }
        ) as Observable<{ token: string }>;
    }

    public newScore(newScoreInfo: NewScoreInfo): Observable<Object> {
        return this.http.post(
            environment.LOCAL_URL + 'leaderboard',
            {
                user_uuid: this.appService.user.uuid,
                name: this.appService.user.name,
                ...newScoreInfo,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.appService.retrieveTokenFromStorage()}`,
                },
            }
        );
    }

    public getLeaderBoard(): Observable<LeaderBoardResponse> {
        return this.http.get(environment.LOCAL_URL + 'leaderboard/top', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.appService.retrieveTokenFromStorage()}`,
            },
        }) as Observable<LeaderBoardResponse>;
    }
}
