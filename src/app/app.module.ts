import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HomeComponent } from "./home/home.component";
import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

import { AngularFireModule } from "@angular/fire";
import {AngularFireStorageModule} from "@angular/fire/storage"
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "../environments/environment";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import {CrudService} from "./services/crud.service"

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,

    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,

    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
  ],
  providers: [CrudService],
  bootstrap: [AppComponent],
})
export class AppModule {}
