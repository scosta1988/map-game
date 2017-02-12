import { Component, ViewEncapsulation, Input } from '@angular/core';
import { MouseEvent } from 'angular2-google-maps/core';
import { NgbCarouselConfig, NgbModal, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';

import 'rxjs/add/operator/map';

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
                private progressBarsConfig: NgbProgressbarConfig){

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
                var self = this;
                self.isLoggingIn = true;
                setTimeout(function(){
                    self.isLoggingIn = false;
                }, 5000);
            }
        }, (reason) => {});
    }

    openSignupModal(content){
        this.email = '';
        this.password = '';

        this.signupModalService.open(content).result.then((result) => {
            if(result == 'signup'){
                var self = this;
                self.isSigningUp = true;
                setTimeout(function(){
                    self.isSigningUp = false;
                }, 5000);
            }
        }, (reason) => {});
    }
}
