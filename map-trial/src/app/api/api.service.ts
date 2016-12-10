import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ApiService {
    constructor(private http: Http) { }

    getChallenge(): Observable<Challenge> {
        return this.http.get('http://localhost:4300/randomChallenge')
            .map(this.handleGetChallenge);
    }

    postChallengeAnswer(ans: Answer): Observable<Result> {
        return this.http.post('http://localhost:4300/challengeAnswer', ans)
                 .map(this.handlePostChallengeAnswer);
    }

    private handleGetChallenge(res: Response) {
        let body = res.json();

        let challenge: Challenge = {
            id: body.id,
            name: body.name
        };

        return challenge;
    }

    private handlePostChallengeAnswer(res: Response) {
        let body = res.json();

        let result: Result = {
            distance: body.distance,
            points: body.points
        };

        return result;
    }
}

export class Challenge {
    id: number;
    name: string;

}

export class Answer {
    id: number;
    lat: number;
    lng: number;
    time: number;
}

export class Result {
    distance: number;
    points: number;
}