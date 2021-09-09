import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ServerURL } from '../_helpers';
import { LoaderService } from './loaderservice';

@Injectable()
export class CalendarService implements Resolve<any>
{
    events: any;
    onEventsUpdated: Subject<any>;
    token;
    url:any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private loader: LoaderService
    ) {
        // Set the defaults
        this.onEventsUpdated = new Subject();
        let t = localStorage.getItem('token').replace('"', '');
        this.token = t.replace('"', '')
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this.getEvents()
            ]).then(
                ([events]: [any]) => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get events
     *
     * @returns {Promise<any>}
     */
    getEvents(): Promise<any> {
        return new Promise((resolve, reject) => {

            //UPLOAD FILE DATA OPTION HEADERS
            const HttpUploadOptions = {
                headers: new HttpHeaders({ 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.token })
            }
            this.loader.start();
            let userType = localStorage.getItem('userType');
            let checkUserType = userType === 'true' ? true : false;
            if (checkUserType) {
                this.url = "?chef_id="+sessionStorage.getItem("chef_Id");
            }else{
                this.url ="";
            }
            this._httpClient.get(ServerURL.SERVER_URL_ENDPOINT + 'schedule'+this.url, HttpUploadOptions)
                .subscribe((response: any) => {
                    this.events = response;
                    this.loader.stop();
                    this.onEventsUpdated.next(this.events);
                    resolve(this.events);
                }, reject);
        });
    }

    /**
     * Update events
     *
     * @param events
     * @returns {Promise<any>}
     */
    updateEvents(events): Promise<any> {
        return new Promise((resolve, reject) => {
            //UPLOAD FILE DATA OPTION HEADERS
            const HttpUploadOptions = {
                headers: new HttpHeaders({ 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.token })
            }
            this._httpClient.post(ServerURL.SERVER_URL_ENDPOINT + 'schedule', HttpUploadOptions
            )
                .subscribe((response: any) => {
                    this.getEvents();
                }, reject);
        });
    }

}
