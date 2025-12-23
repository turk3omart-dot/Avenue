
import React from 'react';
import { AppNotification } from '../types';
import { X, Eye, Heart, MessageCircle, UserPlus, Bell } from 'lucide-react';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onClose: () => void;
  onUserClick: (userId: string) => void;
  onClear: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onClose, onUserClick, onClear }) => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'visit': return <Eye size={14} className="text-stone-400" />;
      case 'reaction': return <Heart size={14} className="text-[#D64545] fill-[#D64545]" />;
      case 'comment': return <MessageCircle size={14} className="text-blue-400" />;
      case 'friend_request': return <UserPlus size={14} className="text-green-500" />;
      default: return <Bell size={14} />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-start p-4 pt-20 animate-in fade-in duration-300">
      <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#F9F7F2] rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-top-10 duration-500">
        <header className="px-8 py-6 flex items-center justify-between border-b border-stone-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-stone-50 p-2 rounded-xl">
              <Bell size={20} className="text-stone-400" />
            </div>
            <h2 className="text-lg font-serif italic text-stone-800">Interactions</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClear} className="text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-stone-800 transition-colors mr-2">Clear</button>
            <button onClick={onClose} className="p-2 bg-stone-50 rounded-full text-stone-400 hover:text-stone-800">
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <button 
                key={n.id}
                onClick={() => { onUserClick(n.userId); onClose(); }}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all text-left ${n.read ? 'bg-white/50 opacity-60' : 'bg-white shadow-sm border border-stone-50'}`}
              >
                <div className="relative shrink-0">
                  <img src={n.userAvatar} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-stone-50">
                    {getIcon(n.type)}
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs text-stone-800 leading-tight">
                    <span className="font-bold">{n.userName}</span> 
                    <span className="text-stone-500"> {n.type === 'visit' ? 'visited your (Moments)' : n.meta}</span>
                  </p>
                  <p className="text-[10px] text-stone-300 uppercase tracking-tighter mt-1 font-bold">{getTimeAgo(n.timestamp)}</p>
                </div>
                {!n.read && <div className="w-2 h-2 bg-[#D64545] rounded-full shrink-0" />}
              </button>
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
              <p className="text-stone-300 italic font-serif">A quiet moment in your world.</p>
              <div className="w-12 h-[1px] bg-stone-100 mx-auto" />
            </div>
          )}
        </div>

        <footer className="p-6 bg-white border-t border-stone-100 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] font-black text-stone-200">Avenue Activity Stream</p>
        </footer>
      </div>
    </div>
  );
};

export default NotificationCenter;
