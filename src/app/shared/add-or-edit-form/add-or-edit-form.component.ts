import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, SelectControlValueAccessor, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ItemModel } from 'src/app/core/interfaces/interfaces';
import { ItemsService } from 'src/app/core/services/items.service';

@Component({
  selector: 'app-add-or-edit-form',
  templateUrl: './add-or-edit-form.component.html',
  styleUrls: ['./add-or-edit-form.component.scss']
})
export class AddOrEditFormComponent implements OnInit {
  toppingList: string[] = ['Action', 'Comedy', 'Drama', 'Crime', 'Fantasy', 'Adventure', 'Sci-Fi', 'Horror', 'Thriller', 'Historic', 'Epic'];
  addoredit: FormGroup = new FormGroup({})
  fileValue!: string;
  // @Input() add!: boolean;
  @Output() sendAdd: EventEmitter<boolean> = new EventEmitter()
  @Input()
  set item(item: any) {
    if (item !== null) {
      this.addoredit = this.setForm(item);
    }else {
      this.addoredit = this.setForm(null);
    }
  }
  @Output() onClose: EventEmitter<boolean> = new EventEmitter();
  constructor(private itemsService: ItemsService, private fb: FormBuilder, private router: Router, private authService: AuthService, private toastr: ToastrService) { }
  ngOnInit(): void {
    this.setForm(null)
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
    // this.addoredit = new FormGroup({
    //   'name': new FormControl(null, Validators.required),
    //   'director': new FormControl(null, Validators.required),
    //   'year': new FormControl(null, Validators.required),
    //   'runtime': new FormControl(null, Validators.required),
    //   'photo': new FormControl(null, Validators.required),
    //   'file': new FormControl(null),
    //   'trailer': new FormControl(null, Validators.required),
    //   'description': new FormControl(null, Validators.required),
    //   'categories': new FormControl(null, Validators.required)
    // })

    // if (this.item?.id && !this.add) {
    //   this.itemsService.getItem(this.item!.id!).subscribe(res => {
    //     this.addoredit.get('name')?.setValue(res.name)
    //     this.addoredit.get('director')?.setValue(res.director)
    //     this.addoredit.get('year')?.setValue(res.year)
    //     this.addoredit.get('runtime')?.setValue(res.runTime)
    //     this.addoredit.get('photo')?.setValue(res.photo)
    //     this.addoredit.get('trailer')?.setValue(res.trailer)
    //     this.addoredit.get('description')?.setValue(res.description)
    //     this.addoredit.get('categories')?.setValue(res.category)
    //   }
    //   )
    // }
  }

  editItem() {
    let edittedMovie: ItemModel = {
      name: this.addoredit.get('name')?.value,
      runTime: this.addoredit.get('runtime')?.value,
      description: this.addoredit.get('description')?.value,
      director: this.addoredit.get('director')?.value,
      photo: this.addoredit.get('photo')?.value,
      id: this.item!.id,
      trailer: this.addoredit.get('trailer')?.value,
      category: this.addoredit.get('categories')?.value,
      year: this.addoredit.get('year')?.value
    }
    this.authService.getUsers().pipe(map((res: any) => {
      const tempDoc: any[] = []
      res.forEach((doc: any) => {
        tempDoc.push({ id: doc.id, ...doc.data() })
      })
      return tempDoc
    })).subscribe(res => {
      for (let user of res) {
        console.log(user.uid)
        for (let i = 0; i < user.savedMovies?.length; i++) {
          if (user.savedMovies[i].id === this.item!.id) {
            user.savedMovies[i] = edittedMovie
            this.authService.getUser(user.uid).update({ savedMovies: user.savedMovies })
          }
        }
      }
    })
    this.itemsService.editItem(this.item!.id!, edittedMovie).subscribe()
    this.toastr.info(`Movie with id:${this.item!.id} was edited.`, 'Success', { positionClass: 'toast-top-center' })
    this.itemsService.itemToAdd.next(edittedMovie)
    this.closeModal()
  }

  addNewItem() {
    let newMovie: ItemModel = {
      name: this.addoredit.get('name')?.value,
      runTime: this.addoredit.get('runtime')?.value,
      comments: [],
      description: this.addoredit.get('description')?.value,
      director: this.addoredit.get('director')?.value,
      photo: this.addoredit.get('photo')?.value,
      rating: [],
      trailer: this.addoredit.get('trailer')?.value,
      category: this.addoredit.get('categories')?.value,
      year: this.addoredit.get('year')?.value
    }
    if (this.fileValue) {
      newMovie.photo = this.fileValue
    }
    this.itemsService.createItem(newMovie).subscribe(res => {
      newMovie.id = res.name
      this.itemsService.itemToAdd?.next(newMovie)
    }
    )
    this.toastr.info(`${this.addoredit.get('name')?.value} was added.`, 'Success', { positionClass: 'toast-top-center' })
    this.closeModal()
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

}

