import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) {

  }

  googleLogin(){
    return this.AuthLogin(new GoogleAuthProvider());
  }

  logout(){
    localStorage.clear();
    return this.afAuth.signOut();
  }

  getCurrentUser(): User | null{
    if (localStorage.getItem('email') != null 
        && localStorage.getItem('displayname') != null){
          let u = new User();
          u.email = localStorage.getItem('email') as string;
          u.name = localStorage.getItem('displayname') as string;
          return u;
        }
    return null;
  }

  AuthLogin(provider: any){
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        if (result.user != undefined){
          localStorage.setItem('email', <string>result.user.email);
          localStorage.setItem('displayname', <string>result.user.displayName);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
}