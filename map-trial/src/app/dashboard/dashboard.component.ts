import { Component } from '@angular/core';

import { ApiService } from '../api/api.service';
import { AccountInfoService } from '../accInfo/accountInfo.service';

@Component({
    selector: 'dashboard-root',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    providers: [ApiService]
})
export class DashboardComponent{

     constructor(private apiService: ApiService,
                 private accountInfoService: AccountInfoService){}

     
}