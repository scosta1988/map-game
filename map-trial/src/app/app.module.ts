import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';

import { AgmCoreModule } from 'angular2-google-maps/core';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAB4t1h0T-CUFkQ9Irg6b59ML-1JtkU2zs'
    }),
    NgbModule.forRoot(),
    HttpModule
  ],
  providers: [],
  bootstrap: [
    AppComponent,
    GameComponent
  ]
})
export class AppModule { }
