import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ServerURL } from '../_helpers';

@Injectable()
export class MenuService implements Resolve<any>
{
    menus: any;
    onMenusUpdated: Subject<any>;
    token;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onMenusUpdated = new Subject();
        let t = localStorage.getItem('token').replace('"','');
        this.token = t.replace('"','')
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise<void>((resolve, reject) => {
            Promise.all([
                this.getMenus()
            ]).then(
                ([menus]: [any]) => {
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
    getMenus(): Promise<any>
    {
        return new Promise((resolve, reject) => {

            //UPLOAD FILE DATA OPTION HEADERS
            const HttpUploadOptions = {
                headers: new HttpHeaders({  'Accept':'application/json','Authorization': 'Bearer ' + this.token })
            }

            this._httpClient.get(ServerURL.SERVER_URL_ENDPOINT + 'menu',HttpUploadOptions)
                .subscribe((response: any) => {
                    console.log(response);
                    this.menus = response;
                    this.onMenusUpdated.next(this.menus);
                    resolve(this.menus);
                }, reject);
        });
    }

    /**
     * Update events
     *
     * @param events
     * @returns {Promise<any>}
     */
    updateMenus(menus): Promise<any>
    {
        const HttpUploadOptions = {
            headers: new HttpHeaders({  'Accept':'application/json','Authorization': 'Bearer ' + this.token })
        }
        return new Promise((resolve, reject) => {
            this._httpClient.post(ServerURL.SERVER_URL_ENDPOINT + 'menu',HttpUploadOptions)
                .subscribe((response: any) => {
                    this.getMenus();
                }, reject);
        });
    }

}
