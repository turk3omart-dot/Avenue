
export type MomentType = 'photo' | 'thought' | 'music' | 'place' | 'sleep' | 'wake' | 'activity' | 'new_friend';

export type MoodType = 'happy' | 'tired' | 'excited' | 'chill' | 'sad' | 'hungry' | 'busy' | 'none';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  friendCount: number;
  lastActive: string;
  mood: MoodType;
  friendIds: string[];
  email?: string;
  dob?: string;
}

export interface AppNotification {
  id: string;
  type: 'visit' | 'reaction' | 'comment' | 'friend_request';
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: Date;
  read: boolean;
  meta?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: Date;
}

export interface Moment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: MomentType;
  content?: string;
  imageUrl?: string;
  attachmentUrl?: string;
  songTitle?: string;
  artist?: string;
  musicProvider?: 'spotify' | 'apple';
  location?: string;
  locationDetails?: string;
  timestamp: Date;
  sleepDuration?: string;
  note?: string;
  reactions: Reaction[];
  comments: Comment[];
  moodAtTime?: MoodType;
  friendName?: string;
  friendAvatar?: string;
}

export type ReactionType = 'smile' | 'laugh' | 'wow' | 'sad' | 'love';

export interface Reaction {
  id: string;
  type: ReactionType;
  userId: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface ChatThread {
  id: string;
  participant: User;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

export type AppView = 'onboarding' | 'auth' | 'timeline' | 'profile' | 'friends' | 'compose' | 'messages' | 'chat' | 'user_preview' | 'notifications';
