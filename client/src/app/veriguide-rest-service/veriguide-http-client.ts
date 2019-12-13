import { LoggedInUser, AuthenticationStateEnum } from '../veriguide-model/models';
import { UserService } from './../veriguide-user-service/user-service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class VeriguideHttpClient implements OnDestroy {

    private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };
    private subscription: Subscription;

    constructor( private http: HttpClient,
                 private userService: UserService ) {

        this.subscription = this.userService.getLoggedInUser().subscribe( loggedInUser => {
            this.loggedInUser = loggedInUser;
        });
    }

    get<T>(url: string, httpParams?: HttpParams ): Observable<T> {
        return this.http.get<T>(url, this.createHttpOptions( httpParams ) ).pipe( share() );
    }

    getBlob(url: string) {
        return this.http.get(url, {
            responseType: 'arraybuffer',
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                Authorization: this.loggedInUser.idToken
            })
        });
    }

    put<T>(url: string, body: any | null): Observable<T> {
        return this.http.put<T>(url, body, this.createHttpOptions() ).pipe( share() );
    }

    post<T>(url: string, body: any | null): Observable<T> {
        return this.http.post<T>(url, body, this.createHttpOptions() ).pipe( share() );
    }

    postFile<T>(url: string, body: any | null): Observable<any> {
        const idToken = this.loggedInUser.idToken;
        return this.http.post<T>(url, body, {
            headers: new HttpHeaders({
                Authorization: idToken
            })
        });
    }

    delete<T>(url: string, httpParams?: HttpParams): Observable<T> {
      return this.http.delete<T>(url, this.createHttpOptions(httpParams)).pipe( share() );
    }

    private createHttpOptions( httpParams?: HttpParams ) {
        const idToken = this.loggedInUser.idToken;
        if ( httpParams ) {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    Authorization: idToken
                }),
                params: httpParams
            };
            return httpOptions;
        } else {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    Authorization: idToken
                })
            };
            return httpOptions;
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
