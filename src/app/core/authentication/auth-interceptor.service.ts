import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  token!: string
  constructor(private auth: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.auth.getId().subscribe(user => {
      user?.getIdToken().then(token => this.token = token)
    })
    req = req.clone({ params: new HttpParams().set('auth', this.token) })
    return next.handle(req)
  }

}


