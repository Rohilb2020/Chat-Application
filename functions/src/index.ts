import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp(functions.config().firebase);

// New message received notification
export const newMessageNotification = functions.firestore
    .document("posts/{postId}")
    .onCreate(async (event) => {
    // getting the message data
      const data = event.data();

      // sender of the message and the message content
      const sender = data.user;
      const msg = data.content;

      // Notification content
      const payload = {
        notification: {
          title: `${sender}`,
          body: `${msg}`,
        },
      };

      const db = admin.firestore();
      const devices = await db.collection("devices").get();

      const tokens: string | any[] = [];

      // loop over to add all the tokensto send the notification to
      devices.forEach((response) => {
        const token = response.data().token;
        tokens.push(token);
      });

      // send notifications
      return admin.messaging().sendToDevice(tokens, payload);
    });
