import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ItemModel } from 'src/app/core/interfaces/interfaces';
import { ItemsService } from 'src/app/core/services/items.service';

@Component({
  selector: 'app-add-or-edit-form',
  templateUrl: './add-or-edit-form.component.html',
  styleUrls: ['./add-or-edit-form.component.scss']
})
export class AddOrEditFormComponent implements OnInit, OnDestroy {
  categoryList: string[] = ['Action', 'Comedy', 'Drama', 'Crime', 'Fantasy', 'Adventure', 'Sci-Fi', 'Horror', 'Thriller', 'Historic', 'Epic'];
  addoredit: FormGroup = new FormGroup({})
  fileValue!: string;
  id!: string
  private unsubscribe$: Subject<void> = new Subject<void>()
  @Output() sendAdd: EventEmitter<boolean> = new EventEmitter()
  @Input()
  set item(item: ItemModel) {
    if (item !== null) {
      this.addoredit = this.setForm(item);
      this.id = item.id!
    } else {
      this.addoredit = this.setForm(null);
    }
  }

  @Output() onClose: EventEmitter<boolean> = new EventEmitter();
  constructor(private itemsService: ItemsService, private fb: FormBuilder, private router: Router, private authService: AuthService, private toastr: ToastrService) { }
  ngOnInit(): void {
  }

  setForm(item: ItemModel | null) {
    return this.fb.group(
      {
        'name': new FormControl(item?.name, Validators.required),
        'director': new FormControl(item?.director, Validators.required),
        'year': new FormControl(item?.year, Validators.required),
        'runtime': new FormControl(item?.runTime, Validators.required),
        'photo': new FormControl(item?.photo, Validators.required),
        'file': new FormControl(null),
        'trailer': new FormControl(item?.trailer, Validators.required),
        'description': new FormControl(item?.description, Validators.required),
        'categories': new FormControl(item?.category, Validators.required)
      }
    )
  }

  saveItem() {
    let edittedMovie: ItemModel = {
      name: this.addoredit.get('name')?.value,
      runTime: this.addoredit.get('runtime')?.value,
      description: this.addoredit.get('description')?.value,
      director: this.addoredit.get('director')?.value,
      photo: this.addoredit.get('photo')?.value,
      id: this.id,
      trailer: this.addoredit.get('trailer')?.value,
      category: this.addoredit.get('categories')?.value,
      year: this.addoredit.get('year')?.value
    }
    this.authService.getUsers().pipe(takeUntil(this.unsubscribe$),map((res: any) => {
      const tempDoc: any[] = []
      res.forEach((doc: any) => {
        tempDoc.push({ id: doc.id, ...doc.data() })
      })
      return tempDoc
    })).subscribe(res => {
      if (this.id) {
        this.itemsService.editItem(this.id, edittedMovie).subscribe()
        this.toastr.info(`Movie with id:${this.id} was edited.`, 'Success', { positionClass: 'toast-top-center' })
        this.itemsService.itemToAdd.next(edittedMovie)
        this.closeModal()
      } else {
        this.itemsService.createItem(edittedMovie).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
          edittedMovie.id = res.name
          this.itemsService.itemToAdd?.next(edittedMovie)
          this.toastr.info(`${this.addoredit.get('name')?.value} was added.`, 'Success', { positionClass: 'toast-top-center' })
          this.closeModal()
        })
      }
      for (let user of res) {
        for (let i = 0; i < user.savedMovies?.length; i++) {
          if (user.savedMovies[i].id === this.id) {
            user.savedMovies[i] = edittedMovie
            this.authService.getUser(user.uid).update({ savedMovies: user.savedMovies })
          }
        }
      }
    })
  }

  getValue(event: any) {
    let reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])
    reader.onloadend = () => {
      let img = new Image();
      img.src = reader.result as string;
      let canvas = document.createElement('canvas')
      canvas.width = 320;
      canvas.height = 480;
      let ctx = canvas.getContext('2d');
      img.onload = () => {
        ctx!.drawImage(img, 0, 0, 320, 480);
        console.log(ctx!.canvas.toDataURL().length)
        this.addoredit.get('photo')?.setValue(ctx!.canvas.toDataURL())
        this.fileValue = ctx!.canvas.toDataURL()
      }
    }
  }

  closeModal() {
    this.sendAdd.emit(false)
    this.onClose.emit(true);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}

