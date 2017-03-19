import { Injectable } from '@angular/core';
import { ApiService, AccountInformationRequest, AccountInformationResponse } from '../api/api.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { Rank } from '../models/rank.model';

let TokenKey: string = "token";

@Injectable()
export class AccountInfoService{

    private UserId: string;
    private Name: string;
    private Token: string;
    private Ranks: Rank[];
    private AvatarURL: string;

    constructor(private apiService: ApiService,
                private cookieService: CookieService){

        let token: string = cookieService.get(TokenKey);

        let req: AccountInformationRequest = {
            token: token
        }

        apiService.accountInformation(req)
            .subscribe(res => {
                let accountInfoResponse: AccountInformationResponse = res as AccountInformationResponse;

                if(accountInfoResponse.ErrCode == 200){ //OK
                    this.UserId = accountInfoResponse.UserId;
                    this.Name = accountInfoResponse.Name;
                    this.Token = token;
                    this.Ranks = accountInfoResponse.Ranks;
                    this.AvatarURL = accountInfoResponse.AvatarUrl;
                }
            });
    }

    GetUserId(): String{
        return this.UserId;
    }
    GetName(): String{
        return this.Name;
    }
    GetToken(): String{
        return this.Token;
    }
    GetRanks(): Rank[]{
        return this.Ranks;
    }
    GetAvatarUrl(): String{
        return this.AvatarURL;
    }
}