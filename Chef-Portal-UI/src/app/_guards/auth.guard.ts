import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    
    
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser.isExpired===false) {
            
            //Open Welcome Popup For first time login user
            // if(currentUser.last_login=='' || currentUser.last_login==null){
            //     this.openWelcomePopup();                       
            // }
            
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }

}