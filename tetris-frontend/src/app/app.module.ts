import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './account/sign-in/sign-in.component';
import { VerifiedEmailComponent } from './account/verified-email/verified-email.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './account/sign-up/sign-up.component';
import { EmailSentComponent } from './account/email-sent/email-sent.component';
import { LoadingScreenComponent } from './static/loading-screen/loading-screen.component';
import { InputComponent } from './static/input/input.component';
import { FormComponent } from './static/form/form.component';
import { ForgotPwComponent } from './account/password/forgot-pw/forgot-pw.component';
import { PasswordResetEmailSentComponent } from './account/password/password-reset-email-sent/password-reset-email-sent.component';
import { ResetPasswordComponent } from './account/password/reset-password/reset-password.component';
import { OptionsComponent } from './menuitems/options/options.component';
import { PlayComponent } from './menuitems/play/play.component';
import { LeaderboardComponent } from './menuitems/leaderboard/leaderboard.component';
import { ShapesComponent } from './menuitems/shapes/shapes.component';
import { AccountComponent } from './menuitems/account/account.component';
import { GeneralInformationComponent } from './menuitems/account/general-information/general-information.component';
import { SignOutComponent } from './menuitems/account/sign-out/sign-out.component';
import { ChangeUsernameComponent } from './menuitems/account/general-information/change-username/change-username.component';
import { ChangeEmailComponent } from './menuitems/account/general-information/change-email/change-email.component';
import { ChangePasswordComponent } from './menuitems/account/general-information/change-password/change-password.component';
import { LeaderboardDetailsComponent } from './static/leaderboard-details/leaderboard-details.component';

@NgModule({
    declarations: [
        AppComponent,
        SignInComponent,
        VerifiedEmailComponent,
        HomeComponent,
        SignUpComponent,
        EmailSentComponent,
        LoadingScreenComponent,
        InputComponent,
        FormComponent,
        ForgotPwComponent,
        PasswordResetEmailSentComponent,
        ResetPasswordComponent,
        OptionsComponent,
        PlayComponent,
        LeaderboardComponent,
        ShapesComponent,
        AccountComponent,
        GeneralInformationComponent,
        SignOutComponent,
        ChangeUsernameComponent,
        ChangeEmailComponent,
        ChangePasswordComponent,
        LeaderboardDetailsComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, FormsModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
