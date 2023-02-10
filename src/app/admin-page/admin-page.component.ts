import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { map, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../core/authentication/auth.service';
import { ItemModel, User } from '../core/interfaces/interfaces';
import { ItemsService } from '../core/services/items.service';
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'uid', 'delete'];
  displayedItemColumns: string[] = ['name', 'director', 'year', 'id', 'edit', 'delete'];
  dataSource: any;
  itemsSource: any;
  add: boolean = false
  toggle: boolean = false
  item!: ItemModel
  private unsubscribe$: Subject<void> = new Subject<void>()

  constructor(private itemsService: ItemsService, private authService: AuthService, private toastr: ToastrService, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.getAllUsers()
    this.getAllItems()
  }

  getAllUsers() {
    this.authService.getUsers().pipe(takeUntil(this.unsubscribe$),map((res: any) => {
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
    this.itemsService.getItems().pipe(takeUntil(this.unsubscribe$),map((res: any) => {
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
      this.itemsService.itemToAdd.pipe(takeUntil(this.unsubscribe$)).subscribe(movie => {
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
    this.dialog.open(ConfirmDeleteComponent, {
      width: '390px',
      disableClose: true
    }).afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      if (res) {
        this.itemsService.delete(item).pipe(takeUntil(this.unsubscribe$)).subscribe()
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
    })
  }

  applyItemFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.itemsSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  modalClosed(toggle: boolean) {
    this.add = false;
    this.toggle = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
