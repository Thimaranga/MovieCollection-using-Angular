import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userLoggedIn: boolean;

  constructor(private afAuth: AngularFireAuth) {
    this.userLoggedIn = false;

    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  }
  loginUser(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signupUser(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }
}
