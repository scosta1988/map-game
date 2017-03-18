import { Component, ViewEncapsulation, Input } from '@angular/core';
import { MouseEvent } from 'angular2-google-maps/core';
import { NgbModal, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';

import 'rxjs/add/operator/map';

import { Utils } from './utils/utils';
import { ApiService, LoginRequest, LoginResponse,
         SignupRequest, SignupResponse } from './api/api.service';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService],
  templateUrl: './app.component.html',
  styleUrls: [
      './app.component.css',
      '../../node_modules/bootstrap/dist/css/bootstrap.css'
    ]
})
export class AppComponent {
    title: string = 'Map Challenge';
    email: string = '';
    password: string = '';

    isLoggingIn: boolean = false;
    isSigningUp: boolean = false;

    constructor(private loginModalService: NgbModal,
                private signupModalService: NgbModal,
                private progressBarsConfig: NgbProgressbarConfig,
                private apiService: ApiService){

        progressBarsConfig.max = 1;
        progressBarsConfig.striped = true;
        progressBarsConfig.animated = true;
        progressBarsConfig.type = 'success';
    }

    openLoginModal(content){
        this.email = '';
        this.password = '';

        this.loginModalService.open(content).result.then((result) => {
            if(result == 'login'){
                this.isLoggingIn = true;

                let utils: Utils = new Utils();
                let passHash = utils.StringToHexSha256(this.password);

                let req: LoginRequest = {
                    email: this.email,
                    passHash: passHash
                };

                this.apiService.login(req)
                    .subscribe(res => {
                        let loginResponse: LoginResponse = res as LoginResponse;
                        if(loginResponse.success){
                            //Navigate to main game page.
                        }
                        else{
                            alert("Login failed. Check your email and password and try again.");
                        }
                        this.isLoggingIn = false;
                    });
            }
        }, (reason) => {});
    }

    openSignupModal(content){
        this.email = '';
        this.password = '';

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
