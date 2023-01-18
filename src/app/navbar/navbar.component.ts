import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { User } from '../interfaces/interfaces';

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
    this.authService.getUser(localStorage.getItem('id')!).get().subscribe(user => {
      this.activeUser = user.data()})}
      logout(): void {
        this.authService.signOut()
      }
}
