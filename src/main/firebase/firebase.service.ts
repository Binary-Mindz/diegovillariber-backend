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

    const p = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (!p) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH missing');
    }

    const fullPath = path.isAbsolute(p) ? p : path.join(process.cwd(), p);
    const file = fs.readFileSync(fullPath, 'utf8');
    const serviceAccount = JSON.parse(file) as admin.ServiceAccount;

    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  messaging() {
    return admin.messaging(this.app);
  }
}