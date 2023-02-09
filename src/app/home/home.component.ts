import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AuthService } from '../core/authentication/auth.service';
import { ItemModel } from '../core/interfaces/interfaces';
import { ItemsService } from '../core/services/items.service';

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
    this.getAvtiveUser()
  }

  getAvtiveUser() {
    this.authService.getId().subscribe(user => {
      this.authService.getUser(user!.uid).get().subscribe(user => {
        this.activeUser = user.data()
        for (let movie of this.activeUser.savedMovies) {
          this.savedMovies.push(movie.id)
        }
      })
    })
  }

  filteredItems: Observable<ItemModel[]> = this.itemsService.filteredItems.pipe(map(items => {
    this.items = items
    return items ?? this.items;
  }
  ))

  addToSavedList(item: ItemModel) {
    if (!this.activeUser?.savedMovies) {
      this.authService.getUser(this.activeUser.uid).update({ savedMovies: [item] })
      this.toastr.success(`${item.name} was added to your save list!`, 'Success', { positionClass: 'toast-top-center' })
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
        this.toastr.success(`${item.name} was added to your save list!`, 'Success', { positionClass: 'toast-top-center' })
      }

    }
    this.savedMovies.push(item.id!)
  }

  addOrRemove(event: string, item: ItemModel) {
    event === 'add' ? this.addToSavedList(item) : this.remove(item)
  }

  remove(item: ItemModel) {
    for (let i = 0; i < this.activeUser.savedMovies.length; i++) {
      if (this.activeUser.savedMovies[i].id === item.id) {
        this.activeUser.savedMovies.splice(i, 1)
        this.authService.getUser(this.activeUser.uid).update({ savedMovies: this.activeUser.savedMovies })
        this.savedMovies.splice(i, 1)
        this.toastr.error(`${item.name} was removed from your save list!`, 'Movie Removed', { positionClass: 'toast-top-center' })
      }
    }
  }
}
