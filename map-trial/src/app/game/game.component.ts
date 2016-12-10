import { Component, OnInit } from '@angular/core';
import { MouseEvent } from 'angular2-google-maps/core';

import 'rxjs/add/operator/map';

import { ApiService, Challenge, Answer, Result } from "../api/api.service";

@Component({
  selector: 'game-root',
  providers: [ApiService],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  title: string = 'Map Challenge';
  
  lat: number = 51.678418;
  lng: number = 7.809007;
  distance: number = 0;
  cityName: string = "";
  cityId: number = 0;
  timeStampStart: number = 0;

  constructor(private apiService: ApiService){}

  ngOnInit() {
    this.apiService.getChallenge()
                   .subscribe(
                     challenge => {
                       this.cityId = challenge.id;
                       this.cityName = challenge.name;
                       this.timeStampStart = Date.now();
                     }
                   );
  }

  mapClick($event : MouseEvent)
  {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;

    let time = Date.now() - this.timeStampStart;

    let answer: Answer ={
      id: this.cityId,
      lat: this.lat,
      lng: this.lng,
      time: time
    };

    this.apiService.postChallengeAnswer(answer)
                   .subscribe(
                     result => {
                       this.distance = Math.round(result.distance) / 1000;
                     }
                   );
  }

  private 
}
