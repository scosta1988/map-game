import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'welcome-root',
  providers: [NgbCarouselConfig],
  templateUrl: './welcome.component.html',
  styleUrls: [
      './welcome.component.css'
    ]
})
export class WelcomeComponent{

    constructor(private carouselConfig: NgbCarouselConfig){
        carouselConfig.interval = 7000;
    }

}