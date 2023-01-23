import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../authentication/auth.service';
import { User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean |  Observable<boolean | UrlTree> | Promise<boolean> {
      if(!localStorage.getItem('id')){
        this.router.navigate(['/login'])
        return false
      }else
      this.auth.getId().subscribe(user => {
        this.auth.getUser(user!.uid).get().subscribe((res: any) => {
          if(res.data().role === 'admin'){
          return true
        }else
        this.router.navigate(['/home'])
        return false
        })
      })
      return true
  }
}
