import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';


@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  onModuleInit() {
    if (admin.apps.length > 0) {
      this.app = admin.app();
      return;
    }

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  messaging() {
    return admin.messaging(this.app);
  }
}