import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { AuthService } from '../core/authentication/auth.service';
import { ItemModel, User } from '../core/interfaces/interfaces';
import { ItemsService } from '../core/services/items.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'uid', 'delete'];
  displayedItemColumns: string[] = ['name', 'director', 'year', 'id', 'edit', 'delete'];
  dataSource: any;
  itemsSource: any;
  add: boolean = false
  toggle: boolean = false
  item!: ItemModel
  constructor(private itemsService: ItemsService, private authService: AuthService, private toastr: ToastrService) { }
  ngOnInit(): void {
    this.getAllUsers()
    this.getAllItems()
  }

  getAllUsers() {
    this.authService.getUsers().pipe(map((res: any) => {
      const tempDoc: any[] = []
      res.forEach((doc: any) => {
        tempDoc.push({ id: doc.id, ...doc.data() })
      })
      return tempDoc
    })).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<User[]>(res)
    })
  }

  emitItem(item: ItemModel | null) {
    this.toggle = true
    this.item = item!
  }

  getAllItems() {
    this.itemsService.getItems().pipe(map((res: any) => {
      const products = []
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          products.push({ ...res[key], id: key })
        }
      }
      return products
    })).subscribe((res) => {
      this.itemsSource = new MatTableDataSource<User[]>(res)
      this.itemsSource!.filterPredicate = function (data: any, filter: string): boolean {
        return data.name.toLowerCase().includes(filter)
      }
      this.itemsService.itemToAdd.subscribe(movie => {
        const data = this.itemsSource.data;
        let check = false
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === movie.id) {
            data[i] = movie
            check = true
          }
        }
        if (!check) {
          data.push(movie)
        }
        this.itemsSource.data = data
      })
    })
  }

  deleteItem(item: ItemModel) {

    if (window.confirm('Are you sure you want to delete this item?')) {//todo
      this.itemsService.delete(item).subscribe()
      for (let user of this.dataSource.data) {
        if (user.savedMovies) {
          for (let i = 0; i < user.savedMovies.length; i++) {
            if (user.savedMovies[i].id === item.id)
              user.savedMovies.splice(i, 1)
            this.authService.getUser(user.uid).update({ savedMovies: user.savedMovies })
          }
        }
      }
      this.toastr.error(`${item.name} was deleted.`, 'Movie Deleted!', { positionClass: 'toast-top-center' })
      this.itemsSource.data.splice(this.itemsSource.data.indexOf(item), 1)
      this.itemsSource._updateChangeSubscription()
    }
  }

  applyItemFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.itemsSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  logout(): void {
    this.authService.signOut()
  }

  modalClosed(toggle: boolean) {
    this.add = false;
    this.toggle = false;
  }
}
