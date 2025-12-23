
import React, { useState, useEffect } from 'react';
import { User, Moment, AppView, MomentType, ReactionType, MoodType, AppNotification, ChatThread } from './types';
import { CURRENT_USER as INITIAL_USER, MOCK_MOMENTS, MOOD_EMOJIS, DISCOVERY_USERS } from './constants';
import PlusMenu from './components/PlusMenu';
import MomentItem from './components/MomentItem';
import ProfileView from './components/ProfileView';
import Onboarding from './components/Onboarding';
import AuthView from './components/AuthView';
import ComposeView from './components/ComposeView';
import MessagesView from './components/MessagesView';
import FriendsListView from './components/FriendsListView';
import UserPreview from './components/UserPreview';
import NotificationCenter from './components/NotificationCenter';
import { Bell, Search, Menu, Users, MessageSquare, CloudSun, Clock, Home, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('onboarding');
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [moments, setMoments] = useState<Moment[]>(MOCK_MOMENTS);
  const [composeType, setComposeType] = useState<MomentType | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [previewUser, setPreviewUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1',
      type: 'visit',
      userId: 'u2',
      userName: 'Sophia Chen',
      userAvatar: 'https://picsum.photos/id/65/100/100',
      timestamp: new Date(Date.now() - 300000),
      read: false
    },
    {
      id: 'n2',
      type: 'reaction',
      userId: 'u3',
      userName: 'Marcus Miller',
      userAvatar: 'https://picsum.photos/id/66/100/100',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
      meta: 'loved your photo'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    
    const visitSim = setTimeout(() => {
      if (Math.random() > 0.5) {
        const visitor = DISCOVERY_USERS[Math.floor(Math.random() * DISCOVERY_USERS.length)];
        const newNotif: AppNotification = {
          id: Math.random().toString(),
          type: 'visit',
          userId: visitor.id,
          userName: visitor.name,
          userAvatar: visitor.avatar,
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    }, 15000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
      clearTimeout(visitSim);
    };
  }, []);

  const handlePost = (data: any) => {
    const newMoment: Moment = {
      id: Math.random().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      type: composeType!,
      timestamp: new Date(),
      reactions: [],
      comments: [],
      moodAtTime: user.mood,
      ...data
    };
    setMoments([newMoment, ...moments]);
    setComposeType(null);
    setView('timeline');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComment = (momentId: string, text: string) => {
    setMoments(prev => prev.map(m => {
      if (m.id === momentId) {
        return {
          ...m,
          comments: [...m.comments, {
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            text,
            timestamp: new Date()
          }]
        };
      }
      return m;
    }));
  };

  const handleReaction = (momentId: string, type: ReactionType) => {
    setMoments(prev => prev.map(m => {
      if (m.id === momentId) {
        const existingIdx = m.reactions.findIndex(r => r.userId === user.id && r.type === type);
        let newReactions = [...m.reactions];
        if (existingIdx > -1) {
          newReactions.splice(existingIdx, 1);
        } else {
          newReactions.push({
            id: Date.now().toString(),
            type,
            userId: user.id
          });
        }
        return { ...m, reactions: newReactions };
      }
      return m;
    }));
  };

  const handleAddFriend = (targetUser: User) => {
    const updatedUser = { ...user, friendIds: [...user.friendIds, targetUser.id] };
    setUser(updatedUser);
    setPreviewUser(null);
    
    const friendMoment: Moment = {
      id: Math.random().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      type: 'new_friend',
      friendName: targetUser.name,
      friendAvatar: targetUser.avatar,
      timestamp: new Date(),
      reactions: [],
      comments: []
    };
    setMoments([friendMoment, ...moments]);
    setView('timeline');
  };

  const updateMood = (mood: MoodType) => {
    const newUser = { ...user, mood };
    setUser(newUser);
    if (viewingUser?.id === user.id) {
      setViewingUser(newUser);
    }
    setShowMoodPicker(false);
  };

  const handleUserClick = (userId: string) => {
    if (userId === user.id) {
      setViewingUser(user);
      setView('profile');
      return;
    }
    const target = DISCOVERY_USERS.find(u => u.id === userId);
    if (target) {
      setPreviewUser(target);
    }
  };

  const navigateToUserProfile = (targetUser: User) => {
    setPreviewUser(null);
    setViewingUser(targetUser);
    setView('profile');
  };

  const handleSignup = (userData: any) => {
    setUser({
      ...user,
      name: userData.name,
      email: userData.email,
      avatar: userData.photo,
      dob: userData.dob
    });
    setView('timeline');
  };

  const handleUpdateProfile = (updated: Partial<User>) => {
    const newUser = { ...user, ...updated };
    setUser(newUser);
    // Crucial: Update the viewed user reference if we're looking at ourselves
    if (viewingUser?.id === user.id) {
      setViewingUser(newUser);
    }
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setShowNotifications(true);
  };

  const moods: MoodType[] = ['happy', 'chill', 'excited', 'tired', 'sad', 'hungry', 'busy', 'none'];
  const isTimelineView = view === 'timeline';
  const isProfileView = view === 'profile';
  const isFriendsView = view === 'friends';
  const isMessagesView = view === 'messages';
  const unreadCount = notifications.filter(n => !n.read).length;

  // Bottom bar visibility logic: only show on main tabs, hide in auth/onboarding or when deep inside a chat
  const hideBottomBar = view === 'onboarding' || view === 'auth' || composeType !== null || activeThread !== null;

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {view === 'onboarding' && (
        <Onboarding onComplete={() => setView('auth')} />
      )}

      {view === 'auth' && (
        <AuthView onComplete={handleSignup} />
      )}

      {composeType && (
        <ComposeView 
          type={composeType} 
          onClose={() => setComposeType(null)} 
          onPost={handlePost} 
        />
      )}

      {view === 'messages' && (
        <MessagesView 
          onBack={() => setView('timeline')} 
          onUserClick={handleUserClick}
          activeThread={activeThread}
          setActiveThread={setActiveThread}
        />
      )}

      {view === 'friends' && (
        <FriendsListView 
          currentUser={user} 
          onBack={() => setView('timeline')} 
          onUserClick={(u) => setPreviewUser(u)}
        />
      )}

      {previewUser && (
        <UserPreview 
          user={previewUser} 
          isFriend={user.friendIds.includes(previewUser.id)} 
          onClose={() => setPreviewUser(null)}
          onAddFriend={handleAddFriend}
          onMessage={(u) => { setPreviewUser(null); setView('messages'); }}
          onViewJournal={navigateToUserProfile}
        />
      )}

      {showNotifications && (
        <NotificationCenter 
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onUserClick={handleUserClick}
          onClear={() => setNotifications([])}
        />
      )}

      {view === 'timeline' && !composeType && (
        <div className="animate-in fade-in duration-700">
          <header className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 overflow-hidden ${isScrolled ? 'h-32 shadow-xl border-b border-stone-200 shadow-stone-200/50' : 'h-20'}`}>
            <div className={`absolute inset-0 transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
              <img src={user.coverImage} className="w-full h-full object-cover" alt="Cover" />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            </div>
            <div className={`relative h-full px-6 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'pt-4' : 'pt-0'}`}>
              <div className="flex items-center gap-4">
                <button onClick={() => { setViewingUser(user); setView('profile'); }} className="relative group shrink-0">
                  <img src={user.avatar} className={`rounded-full border-2 border-white shadow-sm object-cover group-active:scale-95 transition-all duration-500 ${isScrolled ? 'w-12 h-12' : 'w-10 h-10'}`} alt="Profile" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </button>
                <div className="overflow-hidden">
                  <h1 className={`font-serif italic text-white transition-all duration-500 ${isScrolled ? 'text-xl' : 'text-lg text-stone-800 opacity-0'}`}>{user.name}</h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <button onClick={() => setShowMoodPicker(!showMoodPicker)} className={`transition-all duration-500 flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] text-white hover:bg-white/20 ${isScrolled ? 'opacity-100' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>Feeling {MOOD_EMOJIS[user.mood]} {user.mood !== 'none' ? user.mood : 'something...'}</button>
                    {showMoodPicker && (
                      <div className="fixed top-24 left-6 right-6 bg-white rounded-2xl shadow-2xl p-4 border border-stone-100 z-[110] animate-in zoom-in-95 fade-in duration-200">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-3">How are you feeling?</p>
                        <div className="grid grid-cols-4 gap-2">
                          {moods.map(m => (
                            <button key={m} onClick={() => updateMood(m)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${user.mood === m ? 'bg-[#D64545] text-white' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'}`}>
                              <span className="text-lg">{MOOD_EMOJIS[m] || '✖️'}</span>
                              <span className="text-[9px] capitalize">{m === 'none' ? 'Clear' : m}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {!isScrolled && <h1 className="absolute left-[72px] text-lg font-serif italic text-stone-800 animate-in fade-in duration-500">Avenue</h1>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={markNotificationsRead} className={`p-2 rounded-full relative transition-all duration-300 ${isScrolled ? 'text-white bg-white/20 hover:bg-white/30' : 'text-stone-400 hover:text-[#D64545]'}`}>
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D64545] rounded-full border border-white" />}
                </button>
                <button onClick={() => setView('messages')} className={`p-2 rounded-full transition-all duration-300 ${isScrolled ? 'text-white bg-white/20 hover:bg-white/30' : 'text-stone-400 hover:text-[#D64545]'}`}>
                  <MessageSquare size={20} />
                </button>
                <button className={`p-2 rounded-full transition-all duration-300 ${isScrolled ? 'text-white bg-white/20 hover:bg-white/30' : 'text-stone-400 hover:text-stone-600'}`}>
                  <Search size={20} />
                </button>
              </div>
            </div>
          </header>

          <main className="pt-32 pb-40 max-w-lg mx-auto min-h-screen">
            <div className="px-6 mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-serif text-stone-800 italic">(Moments)</h2>
                <p className="text-stone-400 text-[10px] uppercase tracking-[0.2em] mt-1">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {moments.map((moment) => (
                <MomentItem 
                  key={moment.id} 
                  moment={moment} 
                  onComment={handleComment}
                  onReaction={handleReaction}
                  onUserClick={handleUserClick}
                />
              ))}
              {moments.length === 0 && (
                <div className="py-20 text-center opacity-30 italic font-serif">Your timeline is quiet. Share a moment.</div>
              )}
            </div>

            <div className="text-center px-12 py-12">
              <p className="text-stone-300 text-[10px] uppercase tracking-widest font-bold">End of today</p>
            </div>
          </main>
        </div>
      )}

      {view === 'profile' && viewingUser && (
        <ProfileView 
          user={viewingUser} 
          moments={moments}
          onUpdateUser={handleUpdateProfile}
          onBack={() => setView('timeline')}
          onComment={handleComment}
          onReaction={handleReaction}
          onUserClick={handleUserClick}
          isMe={viewingUser.id === user.id}
        />
      )}

      {isTimelineView && !composeType && (
        <PlusMenu onSelect={(type) => setComposeType(type as MomentType)} />
      )}

      {!hideBottomBar && (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-t border-stone-100 pb-8 pt-4 px-8 flex items-center justify-between shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] transition-all animate-in slide-in-from-bottom duration-500">
          <button 
            onClick={() => { setActiveThread(null); setView('timeline'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center gap-1 transition-all active:scale-125 ${isTimelineView ? 'text-[#D64545]' : 'text-stone-300'}`}
          >
            <Home size={22} fill={isTimelineView ? 'currentColor' : 'none'} />
            <span className="text-[8px] uppercase tracking-widest font-black">Home</span>
          </button>
          
          <button 
            onClick={() => { setActiveThread(null); setView('friends'); }}
            className={`flex flex-col items-center gap-1 transition-all active:scale-125 ${isFriendsView ? 'text-[#D64545]' : 'text-stone-300'}`}
          >
            <Users size={22} fill={isFriendsView ? 'currentColor' : 'none'} />
            <span className="text-[8px] uppercase tracking-widest font-black">Circle</span>
          </button>

          <div className="w-12 h-12" />

          <button 
            onClick={() => { setActiveThread(null); setView('messages'); }}
            className={`flex flex-col items-center gap-1 transition-all active:scale-125 ${isMessagesView ? 'text-[#D64545]' : 'text-stone-300'}`}
          >
            <MessageSquare size={22} fill={isMessagesView ? 'currentColor' : 'none'} />
            <span className="text-[8px] uppercase tracking-widest font-black">Inbox</span>
          </button>

          <button 
            onClick={() => { setActiveThread(null); setViewingUser(user); setView('profile'); }}
            className={`flex flex-col items-center gap-1 transition-all active:scale-125 ${isProfileView && viewingUser?.id === user.id ? 'text-[#D64545]' : 'text-stone-300'}`}
          >
            <UserIcon size={22} fill={isProfileView && viewingUser?.id === user.id ? 'currentColor' : 'none'} />
            <span className="text-[8px] uppercase tracking-widest font-black">Me</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
