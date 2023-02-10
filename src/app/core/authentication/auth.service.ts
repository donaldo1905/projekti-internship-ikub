import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usersId!: string;
  constructor(private fireAuth: AngularFireAuth, private router: Router, private fireStore: AngularFirestore, private toastr: ToastrService) { }

  login(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password).then((res) => {
      if (res.user?.emailVerified) {
        res.user?.getIdToken().then(token => {
          localStorage.setItem('token', token)
          this.router.navigate(['/home'])
        })
        
      }
      else {
        this.toastr.error('Please verify your email!', 'Error!', { positionClass: 'toast-top-center' })
      }
    }, err => {
      this.toastr.error(err.message, 'Error!', { positionClass: 'toast-top-center' })
    })
  }

  register(email: string, password: string, user: User) {
    this.fireAuth.createUserWithEmailAndPassword(email, password).then(res => {
      this.registerUser(res.user);
      this.update(user, res.user!.uid)
      this.sendEmailVerification(res.user)
    }, err => {
      this.toastr.error(err.message, 'Error!', { positionClass: 'toast-top-center' })
    }
    )
  }

  registerUser(user: any) {
    const newUser: AngularFirestoreDocument<any> = this.fireStore.doc(
      `users/${user.uid}`
    );
    const userData: any = {
      email: user.email,
      uid: user.uid
    }
    return newUser.set(userData, { merge: true })
  }

  getId() {
    return this.fireAuth.authState
  }

  update(user: User, id: string) {
    this.fireStore.collection('users').doc(id).update({ firstName: user.firstName, lastName: user.lastName, role: user.role, savedMovies: user.savedMovies, photo: user.photo })
  }

  getUser(id: string) {
    return this.fireStore.collection('users').doc<User>(id)
  }

  getUsers() {
    return this.fireStore.collection('users').get()
  }

  signOut() {
    this.fireAuth.signOut().then(() => {
      localStorage.clear()
      this.router.navigate(['/login'])
    }, err => {
      alert(err.message)
    })
  }

  sendEmailVerification(user: any) {
    user.sendEmailVerification().then((res: any) => {
      this.toastr.info('Please verify your Email', 'Email sent', { positionClass: 'toast-top-center' })
    }, () => {
      this.toastr.error('Something went wrong', 'Error', { positionClass: 'toast-top-center' })
    })
  }

  forgotPassword(email: string) {
    this.fireAuth.sendPasswordResetEmail(email).then(() => {
      this.toastr.info('Reset password email has been sent', 'Email sent', { positionClass: 'toast-top-center' })
    }, () => {
      this.toastr.error('Something went wrong', 'Error', { positionClass: 'toast-top-center' })
    })
  }
}
