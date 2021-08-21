import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import firebase from 'firebase/app';

//declaring an interface
interface Post {
  content: string;
  user: string;
  Email: string;
  createdAt: any;
  filePath: string;
}
const time = firebase.firestore.FieldValue.serverTimestamp();

@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.scss'],
})
export class UploadfileComponent implements OnInit {
  @Input() file: File; //gets the input files to be uploaded from the parent component as properties
  // @ViewChild('Uploadcard') input: ElementRef<HTMLIonCardElement>;

  task: AngularFireUploadTask; // Helps in uploading to firebase

  userName: string;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadUrl: string;

  //sending upload message
  user!: Observable<firebase.User>;
  postsCol!: AngularFirestoreCollection<Post>;
  items!: Observable<Post[]>;
  userEmail: string;

  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore
  ) {
    this.userName = JSON.parse(localStorage.getItem('User') || '');
    this.userEmail = JSON.parse(localStorage.getItem('Email') || '');
  }

  ngOnInit() {
    this.startUpload();
  }

  //method to upload
  startUpload() {
    //storage path
    const PATH = `files/${this.userName}/${Date.now()}_${this.file.name}`;

    //reference to storage bucket
    const ref_path = this.storage.ref(PATH);

    //the main task
    this.task = this.storage.upload(PATH, this.file);

    //current progress
    this.percentage = this.task.percentageChanges().pipe(map((x) => x / 100));

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),

      //download url
      finalize(async () => {
        this.downloadUrl = await ref_path.getDownloadURL().toPromise();
        console.log('Url=' + this.downloadUrl);
        this.afs
          .collection('files')
          .add({ downloadUrl: this.downloadUrl, path: PATH });

        //add the information about file upload to database
        this.afs
          .collection('posts')

          .add({
            content: this.file.name,
            user: this.userName,
            Email: this.userEmail,
            createdAt: time,
            filePath: this.downloadUrl,
          });

        // document.getElementById('card').style.display= 'none';
      })
    );
  }

  removeCard(pct: number) {
    if (pct >= 1) {
      return { display: 'none' };
    }
  }

  isActive(snapshot: any) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }
}
