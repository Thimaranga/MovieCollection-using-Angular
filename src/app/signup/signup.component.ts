import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  firebaseErrorMessage: string;
  userLoggedIn: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private fs: AngularFirestore
  ) {
    this.firebaseErrorMessage = "";

    this.userLoggedIn = false;

        this.afAuth.onAuthStateChanged((user) => {
          if (!user) {
            this.userLoggedIn = true;
          } else {
            this.userLoggedIn = false;
          }
        });
  }

  ngOnInit(): void {
  }

  signup(f: NgForm) {
    let data = f.value;
    this.authService
      .signupUser(data.email, data.pass)
      .then((result) => {
        localStorage.setItem("userConnect",result.user.uid);
        this.fs
          .collection("Users")
          .doc(result.user.uid)
          .set({
            fName: data.fName,
            email: data.email,
            country: data.country,
            mobile: data.mNumber,
            uid: result.user.uid,
          })
          .then(() => {
            this.router.navigate(["/dashboard"]);
          });
      })
      .catch(() => {
        console.log("error !");
      });
  }
}
