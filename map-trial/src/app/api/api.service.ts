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

    logout(req: LogoutRequest): Observable<LogoutResponse>{
        return this.http.post('http://localhost:4300/logout', req)
                .map(this.handleLogoutResponse);
    }

    verifyAccount(req: VerifyAccountRequest): Observable<VerifyAccountResponse>{
        return this.http.get('http://localhost:4300/verifyAccount/' + req.hash)
                .map(this.handleVerifyAccountResponse);
    }

    challengeInfo(req: ChallengeInfoRequest): Observable<ChallengeInfoResponse>{
        return this.http.post('http://localhost:4300/challengeInfo', req)
                .map(this.handleChallengeInfoResponse);
    }

    startChallenge(req: StartChallengeRequest): Observable<StartChallengeResponse>{
        return this.http.post('http://localhost:4300/startChallenge', req)
                .map(this.handleStartChallengeResponse);
    }

    cityGuess(req: CityGuessRequest): Observable<CityGuessResponse>{
        return this.http.post('http://localhost:4300/cityGuess', req)
                .map(this.handleCityGuessResponse);
    }

    nextCity(req: NextCityRequest): Observable<NextCityResponse>{
        return this.http.post('http://localhost:4300/nextCity', req)
                .map(this.handleNextCityResponse);
    }

    syncTimeout(req: SyncTimeoutRequest): Observable<SyncTimeoutResponse>{
        return this.http.post('http://localhost:4300/syncTimeout', req)
                .map(this.handleSyncTimeoutResponse);
    }

    getFinalScore(req: GetFinalScoreRequest): Observable<GetFinalScoreResponse>{
        return this.http.post('http://localhost:4300/getFinalScore', req)
                .map(this.handleGetFinalScoreResponse);
    }

    private handleLoginResponse(res: Response): LoginResponse {
        let body = res.json();
        return body as LoginResponse;
    }

    private handleSignupResponse(res: Response): SignupResponse {
        let body = res.json();
        return body as SignupResponse;
    }

    private handleLogoutResponse(res: Response): LogoutResponse{
        let body = res.json();
        return body as LogoutResponse;
    }

    private handleVerifyAccountResponse(res: Response): VerifyAccountResponse{
        let body = res.json();
        return body as VerifyAccountResponse;
    }

    private handleChallengeInfoResponse(res: Response): ChallengeInfoResponse{
        let body = res.json();
        return body as ChallengeInfoResponse;
    }

    private handleStartChallengeResponse(res: Response): StartChallengeResponse{
        let body = res.json();
        return body as StartChallengeResponse;
    }

    private handleCityGuessResponse(res: Response): CityGuessResponse{
        let body = res.json();
        return body as CityGuessResponse;
    }

    private handleNextCityResponse(res: Response): NextCityResponse{
        let body = res.json();
        return body as NextCityResponse;
    }

    private handleSyncTimeoutResponse(res: Response): SyncTimeoutResponse{
        let body = res.json();
        return body as SyncTimeoutResponse;
    }

    private handleGetFinalScoreResponse(res: Response): GetFinalScoreResponse{
        let body = res.json();
        return body as GetFinalScoreResponse;
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
        Ranks: Rank[];
        PicturesURLs: string[];
    }
}

export class StartChallengeRequest{
    token: string;
    challengeId: string;
}
export class StartChallengeResponse{
    ErrCode: number;
    CityName: string;
    Timeout: number;
    MapCentering: MapCentering;
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
    ErrCode: number;
    Points: number;
    Grade: number;
    Ranks: Rank[];
}

export class MapCentering{
    lat: number;
    lng: number;
    zoom: number;
}
export class City{}
export class Rank{}
