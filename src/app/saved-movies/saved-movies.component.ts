import { Component, OnInit } from '@angular/core';
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
constructor(private authService: AuthService, private toastr: ToastrService){}
  ngOnInit(): void {
    this.getActiveUser()
  }

  getActiveUser(){
    this.authService.getId().subscribe(user => {
      this.authService.getUser(user!.uid).get().subscribe(user => {
        this.activeUser = user.data()
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

  logout(): void {
    this.authService.signOut()
  }
}
