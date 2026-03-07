import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

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