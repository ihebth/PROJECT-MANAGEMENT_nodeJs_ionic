/*
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/observable/fromPromise';
import { _throw } from "rxjs/observable/throw";
import { from } from 'rxjs';

import { Observable } from 'rxjs';

import { catchError, mergeMap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
 
@Injectable()
export class InterceptorProvider implements HttpInterceptor {
 
    constructor(private storage: Storage, private alertCtrl: AlertController) { }
 
    // Intercepts all HTTP requests!
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
        let promise = this.storage.get('access_token');
        var observableFromPromise =  from(promise);
;
        return observableFromPromise
                .mergeMap(token => {
                let clonedReq = this.addToken(request, token);
                return next.handle(clonedReq).pipe(
                    catchError(error => {
                        // Perhaps display an error for specific status codes here already?
                        let msg = error.message;
 
 
                        // Pass the error to the caller of the function
                        return _throw(error);
                    })
                );
            });
    }
 
    // Adds the token to your headers if it exists
    private addToken(request: HttpRequest<any>, token: any) {
        if (token) {
            let clone: HttpRequest<any>;
            clone = request.clone({
                setHeaders: {
                    Accept: `application/json`,
                    'Content-Type': `application/json`,
                    Authorization: `Bearer ${token}`
                }
            });
            return clone;
        }
 
        return request;
    }
}*/