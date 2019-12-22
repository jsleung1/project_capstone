
import { UserService } from './../veriguide-user-service/user-service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { share } from 'rxjs/operators';
import { apiEndpoint } from '../config';
import { LoggedInUser, AuthenticationStateEnum } from '../model/loggedInUser';

@Injectable({
    providedIn: 'root'
})
export class VerimarkerHttpClient implements OnDestroy {

    private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };
    private subscription: Subscription;

    constructor( private http: HttpClient,
                 private userService: UserService ) {

        this.subscription = this.userService.getLoggedInUser().subscribe( loggedInUser => {
            this.loggedInUser = loggedInUser;
        });
    }

    get<T>(url: string, httpParams?: HttpParams ): Observable<T> {
        return this.http.get<T>(this.parseHttpUrl(url), this.createHttpOptions( httpParams ) ).pipe( share() );
    }

    getBlob(url: string) {
        return this.http.get(this.parseHttpUrl(url), {
            responseType: 'arraybuffer',
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                Authorization: `Bearer ${ this.loggedInUser.idToken}`
            })
        });
    }

    put<T>(url: string, body: any | null, useParamUrl?: boolean, noAuthHeader?: boolean ): Observable<T> {

        let fullUrl = this.parseHttpUrl(url);
        if ( useParamUrl === true ) {
            fullUrl = url;
        }

        if ( noAuthHeader === true ) {
            return this.http.put<T>(fullUrl, body ).pipe( share() );
        } else {
            return this.http.put<T>(fullUrl, body, this.createHttpOptions() ).pipe( share() );
        }
    }

    patch<T>(url: string, body: any | null): Observable<T> {
        return this.http.patch<T>(this.parseHttpUrl(url), body, this.createHttpOptions() ).pipe( share() );
    }
    
    post<T>(url: string, body: any | null): Observable<T> {
        return this.http.post<T>(this.parseHttpUrl(url), body, this.createHttpOptions() ).pipe( share() );
    }

    postFile<T>(url: string, body: any | null): Observable<any> {
        const idToken = this.loggedInUser.idToken;
        return this.http.post<T>(this.parseHttpUrl(url), body, {
            headers: new HttpHeaders({
                Authorization: idToken
            })
        });
    }

    delete<T>(url: string): Observable<T> {
      return this.http.delete<T>(this.parseHttpUrl(url), this.createHttpOptions()).pipe( share() );
    }

    private createHttpOptions( httpParams?: HttpParams ) {
        const idToken = this.loggedInUser.idToken;
        if ( httpParams ) {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    Authorization: `Bearer ${ this.loggedInUser.idToken}`
                }),
                params: httpParams
            };
            return httpOptions;
        } else {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    Authorization: `Bearer ${ this.loggedInUser.idToken}`
                })
            };
            return httpOptions;
        }
    }

    private parseHttpUrl(subUrl: string): string {
        return `${apiEndpoint}/${subUrl}`;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
