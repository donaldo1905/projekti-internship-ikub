import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { ItemModel } from 'src/app/core/interfaces/interfaces';
import { ItemsService } from 'src/app/core/services/items.service';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit, OnDestroy {

  items: ItemModel[] = []
  searchForm: FormControl = new FormControl('')
  categories: FormControl = new FormControl()
  startYear: FormControl = new FormControl(1970)
  endYear: FormControl = new FormControl(2022)
  startTime: FormControl = new FormControl(100)
  endTime: FormControl = new FormControl(300)
  categoriesOptions: string[] = ['Action', 'Comedy', 'Drama', 'Crime', 'Fantasy', 'Adventure', 'Sci-Fi', 'Horror', 'Thriller', 'Historic', 'Epic'];
  private unsubscribe$: Subject<void> = new Subject<void>()
  
  constructor(private itemsService: ItemsService) { }

  ngOnInit(): void {
    this.getAllItems()
  }

  getAllItems() {
    this.itemsService.getItems().pipe(takeUntil(this.unsubscribe$),map((res: any) => {
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

  filteredMovies: Observable<ItemModel[]> = this.searchForm?.valueChanges.pipe(takeUntil(this.unsubscribe$),startWith(''), debounceTime(200),
    switchMap(searchValue => {
      return of(this.items).
        pipe(map(movies => {
          return movies.filter(movies => movies.name.toLowerCase().includes(searchValue))
        }))
    }))


  filteredByStartYear: Observable<ItemModel[]> = this.startYear?.valueChanges.pipe(takeUntil(this.unsubscribe$),distinctUntilChanged(), startWith(1970), debounceTime(200),
    switchMap(searchValue => {
      return this.filteredMovies.
        pipe(map(movies => {

          return movies.filter(movies =>
            movies.year >= searchValue && movies.name.toLowerCase().includes(this.searchForm.value)
          )
        }))
    }))

  filteredByEndYear: Observable<ItemModel[]> = this.endYear?.valueChanges.pipe(takeUntil(this.unsubscribe$),distinctUntilChanged(), startWith(2022), debounceTime(200),
    switchMap(searchValue => {
      return this.filteredByStartYear.
        pipe(map(movies => {
          return movies.filter(movies => movies.year <= searchValue && movies.year >= this.startYear?.value)
        }))
    }))

  filteredByStartTime: Observable<ItemModel[]> = this.startTime?.valueChanges.pipe(takeUntil(this.unsubscribe$),distinctUntilChanged(), startWith(100), debounceTime(200),
    switchMap(searchValue => {
      return this.filteredByEndYear.
        pipe(map(movies => {
          return movies.filter(movies => movies.runTime >= searchValue && movies.runTime <= this.endTime?.value && movies.year <= this.endYear.value && movies.year >= this.startYear?.value)
        }))
    }))

  filteredByEndTime: Observable<ItemModel[]> = this.endTime?.valueChanges.pipe(takeUntil(this.unsubscribe$),distinctUntilChanged(), startWith(300), debounceTime(200),
    switchMap(searchValue => {
      return this.filteredByStartTime.
        pipe(map(movies => {
          return movies.filter(movies => movies.runTime <= searchValue && movies.runTime >= this.startTime?.value && movies.year <= this.endYear.value && movies.year >= this.startYear?.value)
        }))
    }))

  finalFilter: Observable<ItemModel[]> = this.categories?.valueChanges.pipe(takeUntil(this.unsubscribe$),takeUntil(this.unsubscribe$),distinctUntilChanged(), startWith(''), debounceTime(200),
    switchMap(searchValue => {
      if (searchValue) {
        return this.filteredByEndTime.
          pipe(map(movies => {
            if (this.categories.dirty) {
              this.itemsService.filteredItems.next(movies.filter(movies => movies.category.includes(searchValue) && movies.runTime <= this.endTime.value && movies.runTime >= this.startTime?.value && movies.year <= this.endYear.value && movies.year >= this.startYear?.value))
              return movies.filter(movies => movies.category.includes(searchValue) && movies.runTime <= this.endTime.value && movies.runTime >= this.startTime?.value && movies.year <= this.endYear.value && movies.year >= this.startYear?.value)
            }
            this.itemsService.filteredItems.next(this.items)
            return this.items
          }))
      }
      return this.filteredByEndTime.pipe(map(movies => {
        this.itemsService.filteredItems.next(movies)
        return movies
      }))
    })
  )
  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
