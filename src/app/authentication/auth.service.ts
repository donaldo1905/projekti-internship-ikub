import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs'
import { User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth, private router: Router, private fireStore: AngularFirestore, private toastr: ToastrService) {}

  login(email: string, password: string){
   this.fireAuth.signInWithEmailAndPassword(email,password).then( (res) => {
    localStorage.setItem('id', res.user?.uid!)
    res.user?.getIdToken().then(token => {
      localStorage.setItem('token', token)})
      this.router.navigate(['/home'])
   },err => {
     this.toastr.error(err.message, 'Error!', {positionClass: 'toast-top-center'})
   })
  }

  register(email: string, password: string, user: User){
    this.fireAuth.createUserWithEmailAndPassword(email,password).then( res => {
      localStorage.setItem('id', res.user?.uid!)
      this.registerUser(res.user);
      this.update(user)
      this.router.navigate(['/home'])
    },err => {
      this.toastr.error(err.message, 'Error!', {positionClass: 'toast-top-center'})
    }
     ) 
  }

  registerUser(user: any){
    const newUser: AngularFirestoreDocument<any> = this.fireStore.doc(
      `users/${user.uid}`
    );
    const userData: any = {
        email: user.email,
        uid: user.uid    
      }
      return newUser.set(userData, {merge: true})
  }

  update(user: User){
    this.fireStore.collection('users').doc(localStorage.getItem('id')!).update({firstName: user.firstName, lastName: user.lastName, role: user.role, ratings: user.ratings, savedMovies: user.savedMovies})
  }

  getUser(id: string){
    return this.fireStore.collection('users').doc<User>(id)
  }

  getUsers(){
   return this.fireStore.collection('users').get()
  }

  signOut(){
    this.fireAuth.signOut().then( () => {
      localStorage.clear()
      this.router.navigate(['/login'])
    }, err => {
      alert(err.message)
    })
  }
}
