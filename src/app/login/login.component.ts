import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { FcmService } from '../services/fcm.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userCreds: FormGroup;

  hide = true;
  icon = 'eye';
  public spinner = false;
  constructor(
    public auth: FirebaseService,
    private platform: Platform,
    private fcm: FcmService
  ) {
    this.userCreds = new FormGroup({});
    this.platform.ready().then(() => {
      this.fcm.initPush();
    });
  }

  ngOnInit(): void {
    this.userCreds = new FormGroup({
      emails: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.userCreds.get('emails').setValue('');
    this.userCreds.get('password').setValue('');
  }

  //Error messages for Email
  getErrorMessageEmail() {
    if (this.userCreds.controls.emails.hasError('required')) {
      return 'You must enter a value';
    }
    return this.userCreds.controls.emails.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  //Error messages for password
  getErrorMessagePass() {
    if (this.userCreds.controls.password.hasError('required')) {
      return 'You must enter a value';
    }

    return this.userCreds.controls.password.hasError('minlength')
      ? 'Must be atleast 6 characters'
      : '';
  }

  showPassword() {
    this.hide = !this.hide;

    if (this.icon == 'eye') {
      this.icon = 'eye-off';
    } else {
      this.icon = 'eye';
    }
  }
}
