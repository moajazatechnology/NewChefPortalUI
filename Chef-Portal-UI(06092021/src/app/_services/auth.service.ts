import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from '../_models';
import { ServerURL } from '../_helpers';
import { LoaderService } from './loaderservice';
import { DataService } from './dataservice';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private currentUserSubject: BehaviorSubject<Login>;
    constructor(private http: HttpClient,
        private dataService: DataService,
        private router:Router,
        private loader: LoaderService) {
        this.currentUserSubject = new BehaviorSubject<Login>(JSON.parse(localStorage.getItem('token')));
    }

    public get currentUserValue() {
        const  jwtHelper  = new JwtHelperService();
        // const  Isexpired  = this.currentUserSubject.value ? jwtHelper.isTokenExpired(this.currentUserSubject.value.auth_token) : true;
        const  guardInfo  = {
            'token':this.currentUserSubject.value ? this.currentUserSubject.value.auth_token : null || '', 
            // 'isExpired':Isexpired,
            'auth_admin':this.currentUserSubject.value ? this.currentUserSubject.value.auth_admin : true,
            'isExpired': false
        };
        return guardInfo;
    }
    /** set current uservalue after update welcome popup */
    public set currentUserValue(tokenInfo:any) {
        this.currentUserSubject.next(tokenInfo);
    }

    login(email: string, password: string) {

        //SHOW LOADER BAR #EXTRA Changes
        this.loader.start();
        return this.http.post<any>(`${ServerURL.SERVER_URL_ENDPOINT}auth/login`, { email, password, })
            .pipe(map(loginResponse => {
                console.log(loginResponse);
                this.loader.stop();
                localStorage.setItem('token', JSON.stringify(loginResponse.auth_token));
                localStorage.setItem('userType', JSON.stringify(loginResponse.auth_admin));
                this.currentUserSubject.next(loginResponse);
                return loginResponse;
            }),catchError(err => { return throwError("Error thrown from Server");}));
    }

    customerLogin(email: string, password: string) {

        //SHOW LOADER BAR #EXTRA Changes
        this.loader.start();
        return this.http.post<any>(`${ServerURL.SERVER_URL_ENDPOINT_CUSTOMER}auth/login`, { email, password, })
            .pipe(map(loginResponse => {
                console.log(loginResponse);
                this.loader.stop();
                localStorage.setItem('customertoken', JSON.stringify(loginResponse.authToken));
                this.currentUserSubject.next(loginResponse);
                return loginResponse;
            }),catchError(err => { return throwError("Error thrown from Server");}));
    }

    logout() {
        
        const token = this.currentUserValue.token;
        //remove from database 
        // return this.http.post<any>(`${this.appConfig.url.apiUrl}auth/logout`, { token })
        //     .pipe(map(logoutResponse => {
        //         // login successful if there's a jwt token in the response
              
        //         this._fuseProgressBarService.hide();
        //         if (logoutResponse) {
        //             // store loginResponse details and jwt token in local storage to keep loginResponse logged in between page refreshes
                    localStorage.removeItem('token');
                    localStorage.removeItem('userType');
                    localStorage.removeItem('customertoken');
                    sessionStorage.removeItem('chef_Id');
                    localStorage.removeItem('chefsInfo');
                    localStorage.removeItem('chefsBasketedProduct');
                    this.currentUserSubject.next(null);
                    console.log(this.currentUserSubject);
                    console.log(this.currentUserValue);
                    this.router.navigate(['/']);
        //             localStorage.removeItem('themesettings');
        //             localStorage.removeItem('userInfo');
                    
        //         }
        //         return logoutResponse;
        //     }),catchError(err => { return throwError("Error in logout");}));

   }
}