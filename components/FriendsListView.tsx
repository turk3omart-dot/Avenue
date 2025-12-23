
import React, { useState } from 'react';
import { Search, UserPlus, ArrowLeft, MoreVertical, ShieldCheck, Heart } from 'lucide-react';
import { User } from '../types';
import { DISCOVERY_USERS } from '../constants';

interface FriendsListViewProps {
  currentUser: User;
  onBack: () => void;
  onUserClick: (user: User) => void;
}

const FriendsListView: React.FC<FriendsListViewProps> = ({ currentUser, onBack, onUserClick }) => {
  const [search, setSearch] = useState('');

  const friends = DISCOVERY_USERS.filter(u => currentUser.friendIds.includes(u.id));
  const strangers = DISCOVERY_USERS.filter(u => !currentUser.friendIds.includes(u.id) && u.id !== currentUser.id);

  const filteredFriends = friends.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const filteredStrangers = strangers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-[#F9F7F2] flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-stone-100">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 -ml-2 text-stone-400 hover:text-stone-800 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-serif italic text-stone-800">Your Circle</h2>
          <div className="w-10" />
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#D64545] transition-colors" size={18} />
          <input 
            placeholder="Search for friends or discover..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-red-50 outline-none transition-all"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Current Friends */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-stone-300 font-black">Inner Circle ({friends.length})</h3>
            <ShieldCheck size={14} className="text-stone-200" />
          </div>
          
          <div className="space-y-3">
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friend => (
                <button 
                  key={friend.id}
                  onClick={() => onUserClick(friend)}
                  className="w-full bg-white p-4 rounded-3xl border border-stone-100 flex items-center gap-4 text-left shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <img src={friend.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-stone-800 text-sm">{friend.name}</h4>
                    <p className="text-[10px] text-stone-400 uppercase tracking-tighter">Active {friend.lastActive}</p>
                  </div>
                  <MoreVertical size={16} className="text-stone-300" />
                </button>
              ))
            ) : (
              <p className="text-xs text-stone-400 italic py-4 text-center">No friends found in your circle.</p>
            )}
          </div>
        </div>

        {/* Discovery / Strangers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-stone-300 font-black">Find New Connections</h3>
            <Heart size={14} className="text-stone-200" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {filteredStrangers.length > 0 ? (
              filteredStrangers.map(user => (
                <button 
                  key={user.id}
                  onClick={() => onUserClick(user)}
                  className="bg-white p-4 rounded-[32px] border border-stone-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  <img src={user.avatar} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg mb-3" />
                  <h4 className="font-bold text-stone-800 text-xs truncate w-full px-2">{user.name}</h4>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest mt-1 mb-3">@{user.username}</p>
                  <div className="bg-red-50 text-[#D64545] p-2 rounded-full">
                    <UserPlus size={16} />
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-xs text-stone-300 font-serif italic">The world is quiet right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsListView;
