import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  userData: any;
  constructor(public auth: AngularFireAuth, public router: Router) {}

  Login(email: string, password: string) {
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        this.router.navigate(['user']);
        const userEmail = JSON.stringify(response.user?.email);
        const userName = userEmail?.split(/[ " @ ]+/);
        localStorage.setItem('User', JSON.stringify(userName[1]));
        localStorage.setItem('Email', userEmail);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  Register(email: string, password: string) {
    this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        this.router.navigate(['login']);
        localStorage.setItem('User', JSON.stringify(response.user?.email));
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  //google auth
  GoogleSignIn() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  async AuthLogin(provider: any) {
    try {
      const response = await this.auth.signInWithPopup(provider);
      this.router.navigate(['user']);

      //saving the credentials to localStorage
      const userEmail = JSON.stringify(response.user?.email);
      const userName = userEmail?.split(/[ " @ ]+/);
      localStorage.setItem('User', JSON.stringify(userName[1]));
      localStorage.setItem('Email', userEmail);
    } catch (error) {
      window.alert(error);
    }
  }

  Logout() {
    this.auth.signOut().then(() => {
      localStorage.removeItem('User');
      localStorage.removeItem('Email');
      this.router.navigate(['login']);
    });
  }
}
