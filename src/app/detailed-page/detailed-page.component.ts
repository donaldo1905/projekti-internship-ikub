import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../authentication/auth.service';
import { ItemModel } from '../interfaces/interfaces';
import { ItemsService } from '../services/items.service';

@Component({
  selector: 'app-detailed-page',
  templateUrl: './detailed-page.component.html',
  styleUrls: ['./detailed-page.component.scss']
})
export class DetailedPageComponent implements OnInit {
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

constructor(private itemsService: ItemsService, private route: ActivatedRoute, private authService: AuthService, private router: Router, private sanitizer: DomSanitizer){}
  ngOnInit(): void { 
    this.getItem()
    this.getActiveUser()
    const data = 'some text';
    const blob = new Blob([data], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    window.scrollTo(0, 0)
  }

  getActiveUser(){
    this.authService.getId().subscribe(user => {
      this.authService.getUser(user!.uid).get().subscribe(user => {
        this.activeUser = user.data()
      })
    })
  }

  getItem(){
    this.itemsService.getItem(this.route.snapshot.params['id']).subscribe(item => 
      { 
        if(item){
        this.trailer = item.trailer.slice(0, 24) + 'embed/' +item.trailer.slice(32) + '?autoplay=1'
        this.item = item
        for(let i=0; i<this.item.rating!.length; i++){
          this.sum = this.sum + this.item!.rating![i].rating
        } 
        this.averageRating = this.sum/this.item.rating!.length
        for(let i=0; i<this.item.rating!.length; i++){
          if(this.item.rating![i].id === localStorage.getItem('id')){ 
            this.currentRating = this.item.rating![i].rating
          }
    }}
  else {
    this.router.navigate(['/not-found'])
  }})
  }
  
  logout(): void {
    this.authService.signOut()
  }

  ratingMethod(name: any,){
    let replace = false
    this.sum = 0
 if(this.item?.rating){
  for(let i=0; i<this.item.rating.length; i++){
    if(this.item.rating[i].id === localStorage.getItem('id')){ 
      this.item.rating[i] = {id: localStorage.getItem('id')!, rating: +name.value}
      this.itemsService.rateItem(this.route.snapshot.params['id'], this.item!.rating).subscribe()
      replace = true
    }
    this.sum = this.sum + this.item!.rating[i].rating
    this.averageRating = this.sum/this.item.rating.length
    }
    
    if(!replace){
      this.item.rating.push({id: localStorage.getItem('id')!, rating: +name.value})
      this.itemsService.rateItem(this.route.snapshot.params['id'], this.item.rating).subscribe()
      this.averageRating = this.averageRating/2 + +name.value/2
    }
  }else {
      this.itemsService.rateItem(this.route.snapshot.params['id'], [{id: localStorage.getItem('id')!, rating: +name.value}]).subscribe()
      this.averageRating = +name.value
  }
 
  }

  addComment(){
    let newComment = {
      name : this.activeUser.firstName,
      comment : this.commentForm.value!
    }
    if(this.item?.comments){
      this.item.comments.unshift(newComment)
      this.itemsService.addComment(this.route.snapshot.params['id'], this.item.comments).subscribe()
    }else{
      this.item!.comments = [newComment]
      this.itemsService.addComment(this.route.snapshot.params['id'], [newComment]).subscribe()
    }
    this.commentForm.reset()
  }

  deleteComment(comment: any){
    this.item?.comments!.splice( this.item?.comments!.indexOf(comment), 1)
    this.itemsService.addComment(this.route.snapshot.params['id'], this.item!.comments!).subscribe()
  }
}
