import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase";
import { UserModule } from "../models/user/user.module";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CrudService {
  user: Observable<UserModule | null>;
  authState: string;

  constructor(
    public fireservices: AngularFirestore,
    public fireauth: AngularFireAuth
  ) {
    this.fireauth.user.subscribe((user) => {
      if(user){
        console.log(user);
        this.authState = user.uid
        this.getId(this.authState);
      }
    });
  }


  getId(user:string){
    console.log(this.user);
    return user;
  }

  addNewMovie(Record) {
    return this.fireservices
      .collection("Users")
      .doc(this.authState)
      .collection("Movies")
      .add(Record);
  }

  getAllMovies() {
    return this.fireservices
      .collection("Users")
      .doc("tbhq2AsNqOPSWlZiL9JUQquTxcm2")
      .collection("Movies")
      .snapshotChanges();
  }

  updateMovie(
    recordid: string,
    record: Partial<firebase.firestore.DocumentData>
  ) {
    this.fireservices
      .collection("Users")
      .doc("tbhq2AsNqOPSWlZiL9JUQquTxcm2")
      .collection("Movies")
      .doc(recordid)
      .set(record);
  }

  deleteMovie(recordid) {
    this.fireservices
      .collection("Users")
      .doc("tbhq2AsNqOPSWlZiL9JUQquTxcm2")
      .collection("Movies")
      .doc(recordid)
      .delete();
  }
}
