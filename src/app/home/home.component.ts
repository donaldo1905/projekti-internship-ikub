import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';
import { ItemsService } from '../core/services/items.service';
import { AuthService } from '../core/authentication/auth.service';
import { ItemModel } from '../core/interfaces/interfaces';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  items: ItemModel[] = []
  activeUser: any;
  savedMovies: string[] = [];

  constructor(private authService: AuthService, private itemsService: ItemsService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllItems()
    this.getAvtiveUser()
  }

  getAvtiveUser(){
    this.authService.getId().subscribe(user => {
      this.authService.getUser(user!.uid).get().subscribe(user => {
        this.activeUser = user.data()
        for(let movie of this.activeUser.savedMovies){
          this.savedMovies.push(movie.id)   
        }
      })
    })
  }

  getAllItems(){
    this.itemsService.getItems().pipe(map((res: any) => {
      const movies = []
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          movies.push({ ...res[key], id: key })
        }
      }
      return movies
    })).subscribe((res) => {
      this.items = res;
    })
  }

  logout(): void {
    this.authService.signOut()
  }

    filteredItems: Observable<ItemModel[]> = this.itemsService.filteredItems.pipe(map(items => 
      {
        return items
      }
      ))

  addToSavedList(item: ItemModel) {
      if (!this.activeUser?.savedMovies) {
        this.authService.getUser(this.activeUser.uid).update({ savedMovies: [item] })
        this.toastr.success(`${item.name} was added to your save list!`, 'Success', {positionClass: 'toast-top-center'})
      }
      else {
        let check = false
        for (let movie of this.activeUser!.savedMovies) {
          if (item.id === movie.id) {
            check = true
          }
        }
        if (!check) {
          this.activeUser.savedMovies.push(item)
          this.authService.getUser(this.activeUser.uid).update({ savedMovies: this.activeUser!.savedMovies })
          this.toastr.success(`${item.name} was added to your save list!`, 'Success', {positionClass: 'toast-top-center'})
        }

      }
    this.savedMovies.push(item.id!)
  }
  
  remove(item: ItemModel){
       for(let i = 0; i< this.activeUser.savedMovies.length; i++){
        if(this.activeUser.savedMovies[i].id === item.id){
          this.activeUser.savedMovies.splice(i, 1)
          this.authService.getUser(this.activeUser.uid).update({ savedMovies: this.activeUser.savedMovies })
          this.savedMovies.splice(i,1)
          this.toastr.error(`${item.name} was removed from your save list!`, 'Movie Removed', {positionClass: 'toast-top-center'})
        }
       }
  }
}
