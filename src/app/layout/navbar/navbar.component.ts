import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/authentication/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  activeUser: any
  private unsubscribe$: Subject<void> = new Subject<void>()
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.getAvtiveUser()
  }

  getAvtiveUser() {
    this.authService.getId().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.authService.getUser(user?.uid!).get().subscribe(user => {
        this.activeUser = user.data()
      })
    })
  }

  logout(): void {
    this.authService.signOut()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
