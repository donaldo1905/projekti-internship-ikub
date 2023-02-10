import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/authentication/auth.service';
import { ItemModel } from '../../core/interfaces/interfaces';
import { ItemsService } from '../../core/services/items.service';

@Component({
  selector: 'app-detailed-page',
  templateUrl: './detailed-page.component.html',
  styleUrls: ['./detailed-page.component.scss']
})
export class DetailedPageComponent implements OnInit, OnDestroy {
  item: ItemModel | undefined;
  trailer!: string
  activeUser: any
  averageRating!: number;
  sum = 0;
  currentRating = 0;
  one = new FormControl(1)
  two = new FormControl(2)
  three = new FormControl(3)
  four = new FormControl(4)
  five = new FormControl(5)
  six = new FormControl(6)
  seven = new FormControl(7)
  eight = new FormControl(8)
  nine = new FormControl(9)
  ten = new FormControl(10)
  fileUrl: any;
  commentForm = new FormControl('', Validators.required)
  private unsubscribe$: Subject<void> = new Subject<void>()

  constructor(private itemsService: ItemsService, private route: ActivatedRoute, private authService: AuthService, private router: Router, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.getActiveUser()
  }

  getActiveUser() {
    this.authService.getId().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.authService.getUser(user!.uid).get().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
        this.activeUser = user.data()
        this.itemsService.getItem(this.route.snapshot.params['id']).pipe(takeUntil(this.unsubscribe$)).subscribe(item => {
          if (item) {
            this.trailer = item.trailer.slice(0, 24) + 'embed/' + item.trailer.slice(32) + '?autoplay=1'
            this.item = item
            for (let i = 0; i < this.item.rating!.length; i++) {
              this.sum = this.sum + this.item!.rating![i].rating
            }
            this.averageRating = this.sum / this.item.rating!.length
            for (let i = 0; i < this.item.rating!.length; i++) {
              if (this.item.rating![i].id === this.activeUser?.uid) {
                this.currentRating = this.item.rating![i].rating
              }
            }
          }
          else {
            this.router.navigate(['/not-found'])
          }
        })
      })
    })
    window.scrollTo(0, 0)
  }

  ratingMethod(name: any,) {
    let replace = false
    this.sum = 0
    if (this.item?.rating) {
      for (let i = 0; i < this.item.rating.length; i++) {
        if (this.item.rating[i].id === this.activeUser?.uid) {
          this.item.rating[i] = { id: this.activeUser?.uid, rating: +name.value }
          this.itemsService.rateItem(this.route.snapshot.params['id'], this.item!.rating).pipe(takeUntil(this.unsubscribe$)).subscribe()
          replace = true
          console.log(this.activeUser.uid)
        }
        this.sum = this.sum + this.item!.rating[i].rating
        this.averageRating = this.sum / this.item.rating.length
      }

      if (!replace) {
        this.item.rating.push({ id: this.activeUser?.uid, rating: +name.value })
        this.itemsService.rateItem(this.route.snapshot.params['id'], this.item.rating).pipe(takeUntil(this.unsubscribe$)).subscribe()
        this.averageRating = this.averageRating / 2 + +name.value / 2
        console.log(this.activeUser.uid)
      }
    } else {
      this.itemsService.rateItem(this.route.snapshot.params['id'], [{ id: this.activeUser?.uid, rating: +name.value }]).pipe(takeUntil(this.unsubscribe$)).subscribe()
      this.averageRating = +name.value
      console.log(this.activeUser.uid)
    }

  }

  addComment() {
    let newComment = {
      name: this.activeUser.firstName,
      comment: this.commentForm.value!
    }
    if (this.item?.comments) {
      this.item.comments.unshift(newComment)
      this.itemsService.addComment(this.route.snapshot.params['id'], this.item.comments).pipe(takeUntil(this.unsubscribe$)).subscribe()
    } else {
      this.item!.comments = [newComment]
      this.itemsService.addComment(this.route.snapshot.params['id'], [newComment]).pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    this.commentForm.reset()
  }

  deleteComment(comment: any) {
    this.item?.comments!.splice(this.item?.comments!.indexOf(comment), 1)
    this.itemsService.addComment(this.route.snapshot.params['id'], this.item!.comments!).pipe(takeUntil(this.unsubscribe$)).subscribe()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
