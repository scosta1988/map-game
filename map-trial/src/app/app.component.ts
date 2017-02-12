import { Component, ViewEncapsulation, Input } from '@angular/core';
import { MouseEvent } from 'angular2-google-maps/core';
import { NgbCarouselConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

    constructor(private config: NgbCarouselConfig,
                private loginModalService: NgbModal,
                private signupModalService: NgbModal){

        config.interval = 7000;
    }

    openLoginModal(content){
        this.email = '';
        this.password = '';

        this.loginModalService.open(content).result.then((result) => {
            if(result == 'login'){
                //TODO: Perform login
            }
        }, (reason) => {});
    }

    openSignupModal(content){
        this.email = '';
        this.password = '';

        this.signupModalService.open(content).result.then((result) => {
            if(result == 'signup'){
                //TODO: Perform Signup
            }
        }, (reason) => {});
    }
}
