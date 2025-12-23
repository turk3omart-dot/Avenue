
import { User, Moment, ChatThread } from './types';

export const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  tired: '😴',
  excited: '🤩',
  chill: '🧘',
  sad: '😔',
  hungry: '😋',
  busy: '🏃',
  none: ''
};

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Julian Casablancas',
  username: 'julianc',
  avatar: 'https://picsum.photos/id/64/200/200',
  coverImage: 'https://picsum.photos/id/11/800/400',
  bio: 'Capturing the quiet moments. 150 friends max.',
  friendCount: 42,
  lastActive: 'Just now',
  mood: 'chill',
  friendIds: ['u2', 'u3']
};

export const DISCOVERY_USERS: User[] = [
  {
    id: 'u2',
    name: 'Sophia Chen',
    username: 'sophiec',
    avatar: 'https://picsum.photos/id/65/100/100',
    coverImage: 'https://picsum.photos/id/12/800/400',
    bio: 'Lover of jazz and architecture.',
    friendCount: 89,
    lastActive: '2m ago',
    mood: 'happy',
    friendIds: ['u1']
  },
  {
    id: 'u3',
    name: 'Marcus Miller',
    username: 'marcusm',
    avatar: 'https://picsum.photos/id/66/100/100',
    coverImage: 'https://picsum.photos/id/13/800/400',
    bio: 'Visual artist and world traveler.',
    friendCount: 15,
    lastActive: '1h ago',
    mood: 'chill',
    friendIds: ['u1']
  },
  {
    id: 'u4',
    name: 'Amara Walker',
    username: 'amara_w',
    avatar: 'https://picsum.photos/id/67/100/100',
    coverImage: 'https://picsum.photos/id/14/800/400',
    bio: 'Building things for the web.',
    friendCount: 124,
    lastActive: '30m ago',
    mood: 'excited',
    friendIds: []
  }
];

export const MOCK_CHATS: ChatThread[] = [
  {
    id: 't1',
    participant: DISCOVERY_USERS[0],
    lastMessage: 'That photo you posted was incredible!',
    timestamp: new Date(),
    unread: true
  }
];

export const MOCK_MOMENTS: Moment[] = [
  {
    id: 'm1',
    userId: 'u1',
    userName: 'Julian Casablancas',
    userAvatar: 'https://picsum.photos/id/64/100/100',
    type: 'photo',
    content: 'The golden hour in the city.',
    imageUrl: 'https://picsum.photos/id/10/800/600',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    reactions: [{ id: 'r1', type: 'love', userId: 'u2' }],
    moodAtTime: 'chill',
    comments: [
      {
        id: 'c1',
        userId: 'u2',
        userName: 'Sophia Chen',
        userAvatar: 'https://picsum.photos/id/65/100/100',
        text: 'The light is perfect.',
        timestamp: new Date()
      }
    ]
  },
  {
    id: 'm4',
    userId: 'u2',
    userName: 'Sophia Chen',
    userAvatar: 'https://picsum.photos/id/65/100/100',
    type: 'new_friend',
    friendName: 'Marcus Miller',
    friendAvatar: 'https://picsum.photos/id/66/100/100',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    reactions: [],
    comments: []
  },
  {
    id: 'm2',
    userId: 'u2',
    userName: 'Sophia Chen',
    userAvatar: 'https://picsum.photos/id/65/100/100',
    type: 'music',
    songTitle: 'Selfless',
    artist: 'The Strokes',
    musicProvider: 'spotify',
    content: 'Listening to this on repeat today.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    reactions: [{ id: 'r2', type: 'smile', userId: 'u1' }],
    moodAtTime: 'excited',
    comments: []
  }
];
