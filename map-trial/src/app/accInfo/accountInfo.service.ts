import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Observable } from "rxjs/Observable";

import { ApiService,
         AccountInformationRequest, AccountInformationResponse,
         LoginRequest, LoginResponse,
         LogoutRequest, LogoutResponse } from '../api/api.service';
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

        this.Token = cookieService.get(TokenKey);
    }

    FetchAccountUsingToken(token: string): Observable<void>{
        if(this.Token == null){
            return new Observable<void>();
        }

        let req: AccountInformationRequest = {
                token: this.Token
            }

            return this.apiService.accountInformation(req)
                .map(res => {
                    let accountInfoResponse: AccountInformationResponse = res as AccountInformationResponse;

                    if(accountInfoResponse.ErrCode == 200){ //OK
                        this.UserId = accountInfoResponse.UserId;
                        this.Name = accountInfoResponse.Name;
                        this.Ranks = accountInfoResponse.Ranks;
                        this.AvatarURL = accountInfoResponse.AvatarUrl;
                    }
                    else{ //NotFound or token expired
                        this.cookieService.put(TokenKey, null);
                    }
                });
    }

    GetUserId(): string{
        return this.UserId;
    }
    GetName(): string{
        return this.Name;
    }
    GetToken(): string{
        return this.Token;
    }
    GetRanks(): Rank[]{
        return this.Ranks;
    }
    GetAvatarUrl(): string{
        return this.AvatarURL;
    }

    IsLoggedIn(): boolean{
        return this.Token != null;
    }

    Login(email: string, passHash: string): Observable<boolean>{
        let req: LoginRequest = {
            email: email,
            passHash: passHash
        }

        return this.apiService.login(req)
            .map(res => {
                let loginResponse: LoginResponse = res as LoginResponse;

                if(loginResponse.success){
                    this.Token = loginResponse.token;
                    this.cookieService.put(TokenKey, this.Token);

                    return true;
                }
                else{
                    this.Token = null;
                    this.cookieService.put(TokenKey, null);
                    return false;
                }
            });
    }

    Logout(token: string): Observable<boolean>{
        let req: LogoutRequest = {
            token: token
        }

        return this.apiService.logout(req)
            .map(res => {
                let logoutResponse: LogoutResponse = res as LogoutResponse;
                return logoutResponse.success;
            });
    }
}