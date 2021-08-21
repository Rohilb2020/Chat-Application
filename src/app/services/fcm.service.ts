import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  constructor(
    private router: Router,
    public platform: Platform,
    private afs: AngularFirestore
  ) {}

  initPush() {
    if (this.platform.is('hybrid')) {
      this.registerPush();
    }
  }

  //Registering device for allowing push notification
  private registerPush() {
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.log('ERROR!!Unable to receive notifications');
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + JSON.stringify(token));
      const tokenData = {
        token,
        user: firebase.auth().currentUser,
      };
      this.afs.collection('devices').doc(JSON.stringify(token)).set(tokenData);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }
}
