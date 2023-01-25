import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/authentication/auth.service';
import { User } from '../core/interfaces/interfaces';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  activeUser: any
  constructor(private authService: AuthService){}
  ngOnInit(): void {
    this.getAvtiveUser()
  }

  getAvtiveUser(){
    this.authService.getId().subscribe(user => {
      this.authService.getUser(user!.uid).get().subscribe(user => {
        this.activeUser = user.data()
      })
    })}
      logout(): void {
        this.authService.signOut()
      }
}
