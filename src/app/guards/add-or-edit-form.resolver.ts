import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { ItemsService } from '../services/items.service';

@Injectable({
  providedIn: 'root'
})
export class AddOrEditFormResolver implements Resolve<boolean> {
  constructor(private itemsService: ItemsService, private router: Router){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if(route.paramMap.get('id') === 'add'){
     return of(true)
    }else
    if (route.paramMap.has('id')) {
      return this.itemsService.getItem(route.paramMap.get('id')!).pipe(tap(res=>{
        if(res){
          return of(true)
        }else{ 
          this.router.navigate(['/admin']);
          return EMPTY;
        }
      })
      )
    }
    this.router.navigate(['/admin']);
    return EMPTY;
  }
  }


