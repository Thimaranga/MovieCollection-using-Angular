import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {

  messageError


  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    // this.loginForm = new FormGroup({
    //   email: new FormControl("", [Validators.required, Validators.email]),
    //   password: new FormControl("", Validators.required),
    // });
  }

  ngOnInit(): void {}

  loginUser(f) {
    let data = f.value;
    this.authService
      .loginUser(data.email,data.pass)
      .then((result) => {
          console.log("logging in...");
          localStorage.setItem("userConnect",result.user.uid);
          this.router.navigate(["/dashboard"]);
      }).catch(()=>{
          this.messageError="Incorrect email and password"
      });
  }
}
