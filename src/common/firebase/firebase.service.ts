import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirebaseAdminApp, getFirebaseMessaging } from './firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  onModuleInit() {
    this.app = getFirebaseAdminApp();
  }

  appInstance() {
    return this.app;
  }

  auth() {
    return this.app.auth();
  }

  messaging() {
    return getFirebaseMessaging();
  }
}