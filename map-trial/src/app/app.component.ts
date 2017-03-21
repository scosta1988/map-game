import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MouseEvent } from 'angular2-google-maps/core';
import { NgbModal, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import 'rxjs/add/operator/map';

import { Utils } from './utils/utils';
import { ApiService, LoginRequest, LoginResponse,
         SignupRequest, SignupResponse } from './api/api.service';
import { AccountInfoService } from './accInfo/accountInfo.service';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService, AccountInfoService, CookieService],
  templateUrl: './app.component.html',
  styleUrls: [
      './app.component.css',
      '../../node_modules/bootstrap/dist/css/bootstrap.css'
    ]
})
export class AppComponent implements OnInit{
    title: string = 'Map Challenge';

    email: string = '';
    password: string = '';

    name: string = '';

    isLoggingIn: boolean = false;
    isSigningUp: boolean = false;
    isLoggedIn: boolean = false;

    constructor(private loginModalService: NgbModal,
                private signupModalService: NgbModal,
                private progressBarsConfig: NgbProgressbarConfig,
                private apiService: ApiService,
                private accountInfoService: AccountInfoService,
                private router: Router){

        progressBarsConfig.max = 1;
        progressBarsConfig.striped = true;
        progressBarsConfig.animated = true;
        progressBarsConfig.type = 'success';
    }

    ngOnInit(){
        this.accountInfoService.FetchAccountUsingToken()
            .subscribe(success => {
                if(success){
                    this.isLoggedIn = true;
                    this.name = this.accountInfoService.GetName();
                    
                    this.router.navigateByUrl("/dashboard");
                }
            });
    }

    openLoginModal(content){
        this.loginModalService.open(content).result.then((result) => {
            if(result == 'login'){
                this.isLoggingIn = true;

                let utils: Utils = new Utils();
                let passHash = utils.StringToHexSha256(this.password);

                this.accountInfoService.Login(this.email, passHash)
                    .subscribe(res => {
                        this.email = '';
                        this.password = '';

                        if(res){
                            //TODO: do this inside AccountInfoService.Login
                            this.accountInfoService.FetchAccountUsingToken()
                                .subscribe(res => {
                                    this.isLoggedIn = true;
                                    this.name = this.accountInfoService.GetName();
                                    //Navigate to main game page.
                                });
                            
                        }
                        else{
                            this.isLoggedIn = false;
                            alert("Login failed. Check your email and password and try again.");
                        }
                        this.isLoggingIn = false;
                    });
            }
        }, (reason) => {});
    }

    openSignupModal(content){
        this.signupModalService.open(content).result.then((result) => {
            if(result == 'signup'){
                this.isSigningUp = true;

                let utils: Utils = new Utils();
                let passHash = utils.StringToHexSha256(this.password);

                let req: SignupRequest = {
                    email: this.email,
                    passHash: passHash
                };

                this.apiService.signup(req)
                    .subscribe(res => {
                        this.email = '';
                        this.password = '';
                        
                        let signupResponse: SignupResponse = res as SignupResponse;
                        if(signupResponse.success){
                            alert("Signup successful! Check your email and verify your account!");
                        }
                        else{
                            alert("There was a problem when signing up. Please try again later.");
                        }
                        this.isSigningUp = false;
                    });
            }
        }, (reason) => {});
    }
}
