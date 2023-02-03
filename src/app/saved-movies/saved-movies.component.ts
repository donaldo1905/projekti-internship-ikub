import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../core/authentication/auth.service';
import { ItemModel, User } from '../core/interfaces/interfaces';


@Component({
  selector: 'app-saved-movies',
  templateUrl: './saved-movies.component.html',
  styleUrls: ['./saved-movies.component.scss']
})
export class SavedMoviesComponent implements OnInit {
  activeUser?: User;
  editUser!: FormGroup
  toggleform: boolean = false
constructor(private authService: AuthService, private toastr: ToastrService){}
  ngOnInit(): void {
    this.getActiveUser()
    this.editUser = new FormGroup({
      'name' : new FormControl(this.activeUser?.firstName, Validators.required),
      'photo' : new FormControl(this.activeUser?.photo, Validators.required),
      'lname' : new FormControl(this.activeUser?.lastName, Validators.required)
    })
  }

  getActiveUser(){
    this.authService.getId().subscribe(user => {
      this.authService.getUser(user!.uid).get().subscribe(user => {
        this.activeUser = user.data()
        this.editUser.get('name')?.setValue(user.data()?.firstName)
        this.editUser.get('photo')?.setValue(user.data()?.photo)
        this.editUser.get('lname')?.setValue(user.data()?.lastName)
      })
    })
  }

  remove(item: ItemModel){
       for(let i = 0; i< this.activeUser!.savedMovies.length; i++){
        if(this.activeUser?.savedMovies[i].id === item.id){
          this.activeUser?.savedMovies.splice(i,1)
          this.authService.getUser(this.activeUser?.uid!).update({ savedMovies: this.activeUser?.savedMovies })
          this.toastr.error(`${item.name} was removed from your save list!`, 'Movie Removed', {positionClass: 'toast-top-center'})
        }
       }
  }

  editTheUser(){
    this.authService.getUser(this.activeUser?.uid!).update({'firstName': this.editUser.get('name')?.value, 'photo': this.editUser.get('photo')?.value, 'lastName': this.editUser.get('lname')?.value})
    this.activeUser!.firstName = this.editUser.get('name')?.value
    this.activeUser!.lastName = this.editUser.get('lname')?.value
    this.activeUser!.photo = this.editUser.get('photo')?.value
    this.toggleform = false
  }
}
