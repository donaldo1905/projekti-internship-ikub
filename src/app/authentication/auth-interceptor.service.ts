import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, exhaustMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService){}
intercept(req: HttpRequest<any>, next: HttpHandler){
  // if(localStorage.getItem('token')){
  //   return next.handle(req.clone({params : new HttpParams().set('auth', localStorage.getItem('token')!)}))
  // }else{return throwError('error')}
    // if(!localStorage.getItem('token')){
    //       return next.handle(req);
    //     }else {
    //   const modifiedReq = req.clone({params : new HttpParams().set('auth', localStorage.getItem('token')!)})
    // return next.handle(modifiedReq)}
    req = req.clone({params : new HttpParams().set('auth', localStorage.getItem('token')!)})
    return next.handle(req)
  }
  
}


