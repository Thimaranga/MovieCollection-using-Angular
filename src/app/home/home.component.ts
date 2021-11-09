import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    userLoggedIn: boolean;

    constructor(public afAuth: AngularFireAuth,public router:Router) {
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
        if(!this.userLoggedIn){
            this.router.navigate(["/dashboard"]);
        }
        
    }

    logout(): void {
        this.afAuth.signOut();
    }

}
