import { Component, ViewEncapsulation, Input } from '@angular/core';
import { MouseEvent } from 'angular2-google-maps/core';
import { NgbCarouselConfig, NgbModal, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';

import 'rxjs/add/operator/map';

import { ApiService, LoginRequest, LoginResponse,
         SignupRequest, SignupResponse } from './api/api.service';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbCarouselConfig],
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

    constructor(private config: NgbCarouselConfig,
                private loginModalService: NgbModal,
                private signupModalService: NgbModal,
                private progressBarsConfig: NgbProgressbarConfig,
                private apiService: ApiService){

        config.interval = 7000;

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

                //TODO: hash password
                let req: LoginRequest = {
                    email: this.email,
                    passHash: this.password
                };

                this.apiService.login(req)
                    .subscribe(res => {
                        let loginResponse: LoginResponse = res as LoginResponse;
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

                let req: SignupRequest = {
                    email: this.email,
                    passHash: this.password
                };

                this.apiService.signup(req)
                    .subscribe(res => {
                        let signupResponse: SignupResponse = res as SignupResponse;
                        this.isSigningUp = false;
                    });
            }
        }, (reason) => {});
    }
}
