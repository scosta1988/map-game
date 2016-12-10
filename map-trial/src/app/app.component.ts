import { Component, OnInit } from '@angular/core';
import { MouseEvent } from 'angular2-google-maps/core';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Map Challenge';
}
