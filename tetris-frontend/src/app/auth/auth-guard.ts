import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export function AuthGuard(): CanActivateFn {
    return () => {
        const oauthService: AuthService = inject(AuthService);
        
        if (oauthService.isAuthenticated() ) {
            return true;
        }
        oauthService.navigateToSignIn()
        return false;
    };

}
