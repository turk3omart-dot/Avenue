
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Moment, ReactionType } from '../types';
import { Settings, Camera, Home, Check, X, Music, MessageCircle, Heart, Zap, Award, ArrowLeft } from 'lucide-react';
import MomentItem from './MomentItem';

interface ProfileViewProps {
  user: User;
  moments: Moment[];
  onBack: () => void;
  onUpdateUser: (userData: Partial<User>) => void;
  onComment: (mid: string, text: string) => void;
  onReaction: (mid: string, type: ReactionType) => void;
  onUserClick: (userId: string) => void;
  isMe?: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, moments, onBack, onUpdateUser, onComment, onReaction, onUserClick, isMe = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Sync editedUser if the user prop changes externally
  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const personalMoments = moments.filter(m => m.userId === user.id);
  
  const insights = useMemo(() => {
    const musicArtists = moments
      .filter(m => m.userId === user.id && m.type === 'music' && m.artist)
      .map(m => m.artist!);
    
    const commentsCount: Record<string, number> = {};
    moments.forEach(m => {
      m.comments.forEach(c => {
        if (c.userId === user.id && m.userId !== user.id) {
          commentsCount[m.userName] = (commentsCount[m.userName] || 0) + 1;
        }
      });
    });
    
    const topCommented = Object.entries(commentsCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sophia Chen';

    return {
      topArtists: Array.from(new Set(musicArtists)).slice(0, 3),
      topCommented
    };
  }, [moments, user.id]);

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#F9F7F2] min-h-screen pb-40">
      <input 
        type="file" 
        ref={coverInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => handleImageChange(e, 'coverImage')} 
      />
      <input 
        type="file" 
        ref={avatarInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => handleImageChange(e, 'avatar')} 
      />

      <div className="h-64 bg-stone-300 relative overflow-hidden">
        <img 
          src={isEditing ? editedUser.coverImage : user.coverImage} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
          alt="Cover" 
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        
        <div className="absolute top-8 left-6 flex z-20">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white bg-black/40 px-4 py-2.5 rounded-full backdrop-blur-xl hover:bg-[#D64545] transition-all active:scale-90 border border-white/10 shadow-lg"
          >
            {isMe ? <Home size={18} /> : <ArrowLeft size={18} />}
            <span className="text-[10px] font-bold uppercase tracking-widest">{isMe ? 'Home' : 'Back'}</span>
          </button>
        </div>

        {isEditing && (
          <button 
            onClick={() => coverInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center text-white/80 hover:text-white bg-black/20 transition-all z-10"
          >
            <div className="flex flex-col items-center gap-2">
              <Camera size={32} />
              <span className="text-xs uppercase tracking-widest font-bold">Change Cover</span>
            </div>
          </button>
        )}
      </div>

      <div className="px-6 -mt-24 relative z-10">
        <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-stone-200/50 border border-stone-100">
          <div className="relative mb-6">
            <div className="relative w-32 h-32 mx-auto">
              <img 
                src={isEditing ? editedUser.avatar : user.avatar} 
                className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover" 
                alt={user.name} 
              />
              {isEditing && (
                <button 
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-[#D64545] p-2.5 rounded-full text-white shadow-lg border-2 border-white active:scale-90 transition-transform"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="text-center space-y-4">
            {isEditing ? (
              <div className="space-y-4 px-4">
                <input 
                  autoFocus
                  className="w-full text-center text-2xl font-serif italic text-stone-800 bg-stone-50 border border-stone-100 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-red-50" 
                  value={editedUser.name} 
                  onChange={e => setEditedUser({...editedUser, name: e.target.value})}
                  placeholder="Your name"
                />
                <textarea 
                  className="w-full text-center text-sm text-stone-600 bg-stone-50 border border-stone-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-red-50 resize-none min-h-[100px]"
                  value={editedUser.bio}
                  onChange={e => setEditedUser({...editedUser, bio: e.target.value})}
                  placeholder="Share a little something about yourself..."
                />
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-stone-100 text-stone-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-stone-200 transition-colors">Cancel</button>
                  <button onClick={handleSave} className="flex-1 py-3 bg-[#D64545] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-100 active:scale-95 transition-all">Save Changes</button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-serif italic text-stone-800">{user.name}</h2>
                  <p className="text-stone-400 text-xs tracking-widest font-medium uppercase mt-1">@{user.username}</p>
                </div>
                
                <p className="text-stone-600 text-sm italic px-4 leading-relaxed line-clamp-3">"{user.bio}"</p>

                {isMe && (
                  <div className="flex justify-center pt-2">
                    <button 
                      onClick={() => {
                        setEditedUser(user);
                        setIsEditing(true);
                      }}
                      className="flex items-center gap-2 bg-stone-50 border border-stone-100 text-stone-400 px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-100 hover:text-stone-600 transition-all active:scale-95"
                    >
                      <Settings size={14} />
                      Edit Profile
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-stone-50">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-stone-300 font-bold mb-1">Circles</p>
              <p className="text-lg font-serif text-stone-800">{user.friendCount}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-stone-300 font-bold mb-1">Journey</p>
              <p className="text-lg font-serif text-stone-800">{personalMoments.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-[#D64545] font-bold mb-1">Pulse</p>
              <p className="text-lg font-serif text-[#D64545]">{user.lastActive}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 mt-8">
        <div className="bg-stone-800 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-[#D64545]/20 transition-all duration-700" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#D64545] p-2 rounded-xl">
              <Award size={18} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Daily Insights</h3>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3 text-stone-400">
                <Music size={14} />
                <span className="text-[9px] uppercase tracking-widest font-black">Frequent Soundtrack</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.topArtists.length > 0 ? (
                  insights.topArtists.map(artist => (
                    <span key={artist} className="bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-medium border border-white/5">{artist}</span>
                  ))
                ) : (
                  <span className="text-stone-500 text-[10px] italic">No active soundtrack trends...</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-stone-400">
                  <MessageCircle size={12} />
                  <span className="text-[8px] uppercase tracking-widest font-bold">Talks with</span>
                </div>
                <p className="text-xs font-serif italic">Sophia Chen</p>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D64545] w-[85%]" />
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-stone-400">
                  <Heart size={12} />
                  <span className="text-[8px] uppercase tracking-widest font-bold">Most commented</span>
                </div>
                <p className="text-xs font-serif italic truncate">{insights.topCommented}</p>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white/40 w-[60%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto mt-12">
        <div className="px-6 mb-8 flex items-end justify-between">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-stone-300 font-black">{isMe ? 'Personal' : `${user.name}'s`} (Moments)</h3>
          <div className="h-[1px] flex-1 bg-stone-100 mx-4 translate-y-[-4px]" />
          <Zap size={14} className="text-stone-200" />
        </div>

        {personalMoments.length > 0 ? (
          personalMoments.map(m => (
            <MomentItem 
              key={m.id} 
              moment={m} 
              onComment={onComment} 
              onReaction={onReaction}
              onUserClick={onUserClick}
            />
          ))
        ) : (
          <div className="text-center py-20 px-12">
            <p className="text-stone-300 text-sm italic font-serif">A journey yet to be chronicled on your (Moments).</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
