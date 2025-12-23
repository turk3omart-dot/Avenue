
import React from 'react';
import { User, AppView } from '../types';
import { X, UserPlus, MessageSquare, ShieldCheck, Heart, BookOpen } from 'lucide-react';

interface UserPreviewProps {
  user: User;
  isFriend: boolean;
  onClose: () => void;
  onAddFriend: (user: User) => void;
  onMessage: (user: User) => void;
  onViewJournal?: (user: User) => void;
}

const UserPreview: React.FC<UserPreviewProps> = ({ user, isFriend, onClose, onAddFriend, onMessage, onViewJournal }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-12 animate-in fade-in duration-300">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-[#F9F7F2] rounded-[48px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">
        {/* Cover */}
        <div className="h-40 bg-stone-300 relative">
          {user.coverImage && <img src={user.coverImage} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-black/10" />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-black/20 backdrop-blur-md rounded-full text-white active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Info */}
        <div className="px-8 pb-8 -mt-16 text-center">
          <img src={user.avatar} className="w-32 h-32 rounded-full border-8 border-[#F9F7F2] shadow-xl mx-auto object-cover mb-4" />
          
          <h2 className="text-2xl font-serif italic text-stone-800">{user.name}</h2>
          <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mt-1">@{user.username}</p>
          
          <p className="mt-4 text-sm text-stone-600 italic px-4">"{user.bio}"</p>

          <div className="flex items-center justify-center gap-8 mt-6 py-4 border-y border-stone-100">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-300 font-bold mb-1">Circles</p>
              <p className="text-lg font-serif text-stone-800">{user.friendCount}</p>
            </div>
            <div className="w-[1px] h-8 bg-stone-100" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#D64545] font-bold mb-1">Pulse</p>
              <p className="text-lg font-serif text-[#D64545]">{user.lastActive}</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex gap-3">
              <button 
                onClick={() => onMessage(user)}
                className="flex-1 py-4 bg-white border border-stone-100 rounded-3xl text-stone-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors shadow-sm active:scale-95"
              >
                <MessageSquare size={16} />
                Message
              </button>
              {!isFriend ? (
                <button 
                  onClick={() => onAddFriend(user)}
                  className="flex-1 py-4 bg-[#D64545] text-white rounded-3xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-red-100 active:scale-95 transition-all"
                >
                  <UserPlus size={16} />
                  Add Circle
                </button>
              ) : (
                <button 
                  onClick={() => onViewJournal?.(user)}
                  className="flex-1 py-4 bg-stone-800 text-white rounded-3xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                >
                  <BookOpen size={16} />
                  (Moments)
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-1.5 opacity-30">
            <ShieldCheck size={12} />
            <span className="text-[8px] uppercase tracking-[0.2em] font-black">Avenue Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreview;
