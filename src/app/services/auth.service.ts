import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {Auth, User, user, signInWithEmailAndPassword, createUserWithEmailAndPassword,   } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  user$ = user(this.auth);

  constructor() { }



   signIn(email: string, password: string) {

     return signInWithEmailAndPassword(this.auth, email, password)
    //  .then((userCredential) => {
    //   console.log(userCredential);
    //  }).catch((error) => {
    //     console.error(error);
    //   });
  }


  signUp(email: string, password: string) {
     return createUserWithEmailAndPassword(this.auth, email, password)
  }

  logout() {
    this.auth.signOut();
  }

  getUser() {
    return this.user$;
  }

  getCurrentUser(){
    return this.auth.currentUser;
  }

}
