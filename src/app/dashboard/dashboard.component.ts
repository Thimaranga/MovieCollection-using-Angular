import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldControl } from "@angular/material/form-field";
import { NgForm } from "@angular/forms";
import { CrudService } from "../services/crud.service";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from "@angular/fire/storage";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  providers: [
    { provide: MatFormFieldControl, useExisting: DashboardComponent },
  ],
})
export class DashboardComponent implements OnInit {
  @ViewChild("callAPIDialog") callAPIDialog: TemplateRef<any>;
  @ViewChild("callAPIDialogEdit") callAPIDialogEdit: TemplateRef<any>;

  searchText: any;

  closeResult: string;
  userID: string;

  listedMovies: any;
  listedMovieEdit: any;
  mId: string;
  mName: string;
  mCategory: string;
  mRating: string;
  mDescription: string;
  mImageURL: any;
  tempUrlForUpdate: any;

  uId;
  dataProfile = {
    fName: "",
    email: "",
    country: "",
    mobile: "",
    uid: "",
  };
  record: {
    title: "";
    category: "";
    description: "";
    rating: "";
    imageURL: "";
  };

  task: AngularFireUploadTask;
  ref: AngularFireStorageReference;
  persentage: Observable<number>;

  userLoggedIn: boolean;

  datePipe: DatePipe = new DatePipe('en-US');

  constructor(
    public afAuth: AngularFireAuth,
    public dialog: MatDialog,
    public crudservice: CrudService,
    private fs: AngularFirestore,
    private fst: AngularFireStorage,
    private sanitizer: DomSanitizer,
    private router:Router
  ) {
    this.userLoggedIn = false;

    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  }

  getformattedDate(){
    
    var date = new Date();
    var transformDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    return transformDate;

  }

  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  isCheck(form: NgForm) {
    this.searchText = form.value["search"];
  }

  openDialog() {
    let dialogRef = this.dialog.open(this.callAPIDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (result !== "no") {
          const enabled = "Y";
          console.log(result);
        } else if (result === "no") {
          console.log("User clicked no.");
        }
      }
    });
  }

  onEdit(item) {
    let dialogRef = this.dialog.open(this.callAPIDialogEdit);
    this.setEditRecord(item);
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (result !== "no") {
          const enabled = "Y";
          console.log(result);
        } else if (result === "no") {
          console.log("User clicked no.");
        }
      }
    });
  }

  onSend(form: NgForm) {
    let Record = {};
    if (form.status === "INVALID") {
      // display error in the form
    } else {
      Record["title"] = form.value["mName"];
      Record["category"] = form.value["mCategory"];
      Record["rating"] = form.value["mRating"];
      Record["description"] = form.value["mDescription"];
      Record["imageURL"] = this.tempUrlForUpdate;
      Record["modifyDate"] = this.getformattedDate();

      this.fs
        .collection("Users")
        .doc(localStorage.getItem("userConnect"))
        .collection("Movies")
        .add(Record)
        .then((res) => {
          console.log(form.value);
          this.dialog.closeAll(); // Close opened dialog
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  uploadImage(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.fst.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.persentage = this.task.percentageChanges();
    this.task.then((data) => {
      data.ref.getDownloadURL().then((url) => {
        this.tempUrlForUpdate = url;
        console.log(url);
      });
    });
  }

  setEditRecord(Record) {
    this.mId = Record.id;
    this.mName = Record.title;
    this.mCategory = Record.category;
    this.mRating = Record.rating;
    this.mDescription = Record.description;
    this.mImageURL = Record.imageURL;
  }

  Updatarecord(recorddata) {
    let catchData = recorddata.value;
    let temImg;
    if (this.tempUrlForUpdate != null) {
      temImg = this.tempUrlForUpdate;
    } else {
      temImg = this.mImageURL;
    }
    console.log(this.mId);
    return this.fs
      .collection("Users")
      .doc(localStorage.getItem("userConnect"))
      .collection("Movies")
      .doc(this.mId)
      .update({
        title: catchData.eName,
        category: catchData.eCategory,
        rating: catchData.eRating,
        description: catchData.eDescription,
        imageURL: temImg,
        modifyDate:this.getformattedDate()
      })
      .then(() => {
        this.dialog.closeAll();
      });
  }

  deleteMovie(recordID) {
    return this.fs
      .collection("Users")
      .doc(localStorage.getItem("userConnect"))
      .collection("Movies")
      .doc(recordID)
      .delete();
  }

  ngOnInit(): void {
    if (!this.userLoggedIn) {
      this.router.navigate(["/dashboard"]);
    } else {
      this.router.navigate([""]);
    }

    this.fs
      .collection("Users")
      .ref.doc(localStorage.getItem("userConnect"))
      .get()
      .then((data) => {
        if (!data) {
          console.log(data.data());
          this.dataProfile.fName = data.data()["fName"];
          this.dataProfile.email = data.data()["email"];
          this.dataProfile.country = data.data()["country"];
          this.dataProfile.mobile = data.data()["mobile"];
          this.dataProfile.uid = data.data()["uid"];
        } else {
          console.log("No User Data Recorded");
        }
      });

    this.fs
      .collection("Users")
      .doc(localStorage.getItem("userConnect"))
      .collection("Movies")
      .snapshotChanges()
      .subscribe((data) => {
        this.listedMovies = data.map((e) => {
          return {
            id: e.payload.doc.id,
            title: e.payload.doc.data()["title"],
            category: e.payload.doc.data()["category"],
            rating: e.payload.doc.data()["rating"],
            description: e.payload.doc.data()["description"],
            imageURL: e.payload.doc.data()["imageURL"],
          };
        });
        console.log(this.listedMovies);
      });
  }

  logout(): void {
    this.afAuth.signOut();
  }

  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
}
