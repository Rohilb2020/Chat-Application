import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import firebase from 'firebase/app';
import { FormGroup, FormControl } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs';
import { map } from 'rxjs/operators';

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
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  userForm = new FormGroup({
    content: new FormControl(''),
  });

  count: number;
  userName: string;
  user!: Observable<firebase.User>;
  postsCol!: AngularFirestoreCollection<Post>;
  items!: Observable<Post[]>;
  userEmail: string;

  constructor(private afs: AngularFirestore, public auth: FirebaseService) {
    this.count = 0;

    this.userName = JSON.parse(localStorage.getItem('User') || '');
    this.userEmail = JSON.parse(localStorage.getItem('Email') || '');

    this.postsCol = afs.collection<Post>('posts', (ref) =>
      ref.orderBy('createdAt', 'desc').limit(10)
    );

    this.items = this.postsCol
      .valueChanges()
      .pipe(map((data) => data.reverse()));
  }

  files: File[] = []; //array containing the files

  ngOnInit(): void {}

  //Sending message method
  addPost() {
    this.afs
      .collection('posts')

      .add({
        content: this.userForm.get('content')?.value,
        user: this.userName,
        Email: this.userEmail,
        createdAt: time,
        filePath: '',
      });
    this.count++;
    this.userForm.setValue({
      content: '',
    });
  }

  convertToDate(time: any) {
    return time.toDate().toLocaleString();
  }

  //Attach method triggers the input file tag
  attach(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }
}
