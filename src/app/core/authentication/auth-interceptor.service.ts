import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    req = req.clone({ params: new HttpParams().set('auth', localStorage.getItem('token')!) })
    return next.handle(req)
  }

}


