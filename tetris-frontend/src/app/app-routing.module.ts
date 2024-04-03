import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { EmailSentComponent } from './account/email-sent/email-sent.component';
import { ForgotPwComponent } from './account/password/forgot-pw/forgot-pw.component';
import { HomeComponent } from './home/home.component';
import { PasswordResetEmailSentComponent } from './account/password/password-reset-email-sent/password-reset-email-sent.component';
import { ResetPasswordComponent } from './account/password/reset-password/reset-password.component';
import { SignInComponent } from './account/sign-in/sign-in.component';
import { SignUpComponent } from './account/sign-up/sign-up.component';
import { VerifiedEmailComponent } from './account/verified-email/verified-email.component';
import { OptionsComponent } from './menuitems/options/options.component';
import { LeaderboardComponent } from './menuitems/leaderboard/leaderboard.component';
import { PlayComponent } from './menuitems/play/play.component';
import { AccountComponent } from './menuitems/account/account.component';
import { ShapesComponent } from './menuitems/shapes/shapes.component';
import { GeneralInformationComponent } from './menuitems/account/general-information/general-information.component';
import { SignOutComponent } from './menuitems/account/sign-out/sign-out.component';
import { ChangeUsernameComponent } from './menuitems/account/general-information/change-username/change-username.component';
import { ChangeEmailComponent } from './menuitems/account/general-information/change-email/change-email.component';
import { ChangePasswordComponent } from './menuitems/account/general-information/change-password/change-password.component';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'email-sent', component: EmailSentComponent },
    { path: 'verified-email/:uuid', component: VerifiedEmailComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard()] },
    { path: 'options/:inGame', component: OptionsComponent, canActivate: [AuthGuard()] },
    { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard()] },
    { path: 'play', component: PlayComponent, canActivate: [AuthGuard()] },
    { path: 'account', redirectTo: 'account/general-information', pathMatch: 'full' },
    {
        path: 'account',
        component: AccountComponent,
        children: [
            { path: 'general-information', component: GeneralInformationComponent },
            { path: 'sign-out', component: SignOutComponent },
            { path: 'change-username', component: ChangeUsernameComponent },
            { path: 'change-email', component: ChangeEmailComponent },
            { path: 'change-password', component: ChangePasswordComponent },
        ],
        canActivate: [AuthGuard()],
    },
    { path: 'shapes', component: ShapesComponent, canActivate: [AuthGuard()] },
    { path: 'password-reset-email-sent', component: PasswordResetEmailSentComponent },
    { path: 'forgot-password', component: ForgotPwComponent },
    { path: 'reset-password/:auth-token', component: ResetPasswordComponent },
    { path: '**', redirectTo: 'sign-in', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes), RouterOutlet],
    exports: [RouterModule],
})
export class AppRoutingModule {}
