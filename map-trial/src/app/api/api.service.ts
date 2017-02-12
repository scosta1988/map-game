import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ApiService {
    constructor(private http: Http) { }

    login(req: LoginRequest): Observable<LoginResponse>{
        return this.http.post('http://localhost:4300/login', req)
                .map(this.handleLoginResponse);
    }

    signup(req: SignupRequest): Observable<SignupResponse>{
        return this.http.post('http://localhost:4300/login', req)
                .map(this.handleSignupResponse);
    }

    private handleLoginResponse(res: Response) {
        let body = res.json();

        let result: LoginResponse = {
            success: body.success,
            token: body.token
        };

        return result;
    }

    private handleSignupResponse(res: Response) {
        let body = res.json();

        let result: SignupResponse = {
            success: body.success
        };

        return result;
    }
}

export class LoginRequest{
    email: string;
    passHash: string;
}
export class LoginResponse{
    success: boolean;
    token: string;
}

export class SignupRequest{
    email: string;
    passHash: string;
}
export class SignupResponse{
    success: boolean;
}

export class LogoutRequest{
    token: string;
}
export class LogoutResponse{
    success: boolean;
}

export class VerifyAccountRequest{
    hash: string;
}
export class VerifyAccountResponse{
    success: boolean;
}

export class CityGuessRequest{
    lat: number;
    lng: number;
    token: string;
}
export class CityGuessResponse{
    ErrCode: number;
    Distance: number;
    Points: number;
    Lat: number;
    Lng: number;
}

export class ChallengeInfoRequest{
    token: string;
    challengeId: string;
}
export class ChallengeInfoResponse{
    ErrCode: number;
    ChallengeModel: {
        Name: string;
        Description: string;
        NumOfCities: number;
        Ranks: string[];
        PicturesURLs: string[];
    }
}

export class StartChallengeRequest{
    token: string;
    challengeId: string;
}
export class StartChallengeResponse{

}

export class NextCityRequest{
    token: string;
}
export class NextCityResponse{
    ErrCode: number;
    CityName: string;
    Timeout: number;
    MapCentering: MapCentering;
}

export class SyncTimeoutRequest{
    token: string;
}
export class SyncTimeoutResponse{
    ErrCode: number;
    CityId: string;
    Timeout: number;
}

export class GetFinalScoreRequest{
    token: string;
}
export class GetFinalScoreResponse{

}

export class MapCentering{
    lat: number;
    lng: number;
    zoom: number;
}
export class City{

}
