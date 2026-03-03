export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  MENTION = 'MENTION',
  TAGGED = 'TAGGED',
  SHARE = 'SHARE',

  BATTLE_INVITE = 'BATTLE_INVITE',
  BATTLE_RESULT = 'BATTLE_RESULT',
  CHALLENGE_INVITE = 'CHALLENGE_INVITE',
  CHALLENGE_RESULT = 'CHALLENGE_RESULT',

  LAPTIME_BEATEN = 'LAPTIME_BEATEN',
  LAPTIME_COMPARE = 'LAPTIME_COMPARE',

  SYSTEM = 'SYSTEM',
  ADMIN = 'ADMIN',
}

export enum NotificationEntityType {
  POST = 'POST',
  COMMENT = 'COMMENT',
  USER = 'USER',
  PROFILE = 'PROFILE',

  BATTLE = 'BATTLE',
  CHALLENGE = 'CHALLENGE',

  SUBMIT_LAB_TIME = 'SUBMIT_LAB_TIME',
  LAB_TIME = 'LAB_TIME',

  PRIZE = 'PRIZE',
  PAYMENT = 'PAYMENT',
  EVENT = 'EVENT',

  OTHER = 'OTHER',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
}

export type FirestoreNotification = {
  id?: string;

  userId: string;
  actorUserId?: string | null;

  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;

  title?: string | null;
  message?: string | null;

  deepLink?: string | null;

  entityType?: NotificationEntityType | null;
  entityId?: string | null;

  meta?: Record<string, any> | null;
  groupKey?: string | null;

  readAt?: any | null;     // Firestore timestamp
  createdAt?: any;         // Firestore timestamp
  updatedAt?: any;         // Firestore timestamp
};