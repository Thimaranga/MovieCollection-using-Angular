import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldControl } from "@angular/material/form-field";
import { NgForm } from "@angular/forms";
import { CrudService } from "../services/crud.service";

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
  mId:string;
  mName: string;
  mCategory: string;
  mRating: string;
  mDescription: string;
  mImageURL: string;

  constructor(
    public afAuth: AngularFireAuth,
    public dialog: MatDialog,
    public crudservice: CrudService
  ) {}

  isCheck(form: NgForm){
    this.searchText=form.value['search'];
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
    this.EditRecord(item);
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
      Record["imageURL"] = form.value["mImage"];

      this.crudservice
        .addNewMovie(Record)
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

  EditRecord(Record)
  {
    this.mId=Record.id;
    this.mName = Record.title;
    this.mCategory = Record.category;
    this.mRating = Record.rating;
    this.mDescription = Record.description;
    this.mImageURL = Record.imageURL;

  }

  Updatarecord(recorddata) {
    let record: { };
    record["title"] = recorddata.editTitle;
    record["category"] = recorddata.editCategory;
    record["rating"] = recorddata.editRating;
    record["description"] = recorddata.editDescription;
    if(recorddata.editImageUrl!=null){
      record["imageURL"] = recorddata.editImageUrl;
    }else{
      record["imageURL"] = this.mImageURL;
    }
    console.log(this.mId);
    return this.crudservice.updateMovie(this.mId, record);
  }

  deleteMovie(recordID){
    return this.crudservice.deleteMovie(recordID);
  }

  ngOnInit(): void {
    // this.getMovies();
    this.crudservice.getAllMovies().subscribe((data) => {
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

  // getMovies = () =>
  //   this.crudservice
  //     .getAllMovies()
  //     .subscribe((res) => (this.listedMovies = res));

  logout(): void {
    this.afAuth.signOut();
  }

  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
}
