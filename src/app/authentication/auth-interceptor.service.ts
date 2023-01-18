import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService){}
intercept(req: HttpRequest<any>, next: HttpHandler){
  return this.auth.loggedUser.pipe(
    take(1),
    exhaustMap(
    user => {
    if (!user) {
          return next.handle(req);
        }
      const modifiedReq = req.clone({params : new HttpParams().set('auth', user)})
    return next.handle(modifiedReq)
    
  }))
  
}

}
