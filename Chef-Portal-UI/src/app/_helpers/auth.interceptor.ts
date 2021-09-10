import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../_services';
import { LoaderService } from '../_services/loaderservice';

@Injectable()

export class LoaderAuthInterceptor implements HttpInterceptor {

   authToken: any;

   constructor(
   	private router: Router,
	private loaderService: LoaderService,
	private _authService: AuthService) {
   }
  
   	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		this.loaderService.start();

    	let changedRequest = request;
	    const headerSettings: {[name: string]: string | string[]; } = {};

	    for (const key of request.headers.keys()) {
	      headerSettings[key] = request.headers.getAll(key);
		}	
			this.authToken = this._authService.currentUserValue.tokenstring ? this._authService.currentUserValue.tokenstring : "";
			// this.authToken = token ? token : "";
			if (this.authToken) {
			headerSettings['Authorization'] = 'Bearer ' + this.authToken;
			}
		
		
	    if(changedRequest.url){
		    const newHeader = new HttpHeaders(headerSettings);
		    changedRequest = request.clone({headers: newHeader});
	    }
		//return next.handle(changedRequest);
	    return next.handle(changedRequest).pipe(tap((event: HttpEvent<any>) => { 
	      if (event instanceof HttpResponse) {
	      	if(event?.body?.errorcode==391)
	      	{
	      		// this._authService.logout().subscribe(response =>{
		        //   if(response.logout===true)
		        //   {
		        //     this.router.navigate(['/authentication/login']);        
		        //   }
		        // });
				this._authService.logout();
				this.router.navigate(['/']);
	      	}
	      }
	    },
	      (err: any) => {
			this.onEnd(err);
	    })); //HIDE LOADER 
	
}

	private onEnd(err:any): void {
		this.loaderService.stop();
		if(err.status==0){
			//this.router.navigate(['/pages/auth/lock']); 
			console.log("err>>>>>>>>>>>>>",err);
		}
	}
}