
import React, { useState, useRef } from 'react';
import { ArrowLeft, Send, MoreHorizontal, Paperclip, Search, User as UserIcon, BellOff, Zap, Moon, X } from 'lucide-react';
import { ChatThread, Message } from '../types';
import { MOCK_CHATS, CURRENT_USER } from '../constants';

interface MessagesViewProps {
  onBack: () => void;
  onUserClick: (userId: string) => void;
  activeThread: ChatThread | null;
  setActiveThread: (thread: ChatThread | null) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ onBack, onUserClick, activeThread, setActiveThread }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [msg, setMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [mutedThreads, setMutedThreads] = useState<Set<string>>(new Set());
  const [showMenu, setShowMenu] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'u2', text: 'Hey Julian, did you catch the game?', timestamp: new Date(Date.now() - 3600000) },
    { id: '2', senderId: 'u1', text: 'Not yet! Recording at the studio today.', timestamp: new Date(Date.now() - 1800000) }
  ]);

  const playPingSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn("Audio Context failed", e);
    }
  };

  const handlePing = () => {
    setIsShaking(true);
    playPingSound();
    setShowMenu(false);
    setTimeout(() => setIsShaking(false), 500);
  };

  const toggleMute = (threadId: string) => {
    const newMuted = new Set(mutedThreads);
    if (newMuted.has(threadId)) newMuted.delete(threadId);
    else newMuted.add(threadId);
    setMutedThreads(newMuted);
    setShowMenu(false);
  };

  const filteredChats = MOCK_CHATS.filter(c => 
    c.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (activeThread) {
    const isMuted = mutedThreads.has(activeThread.id);

    return (
      <div className={`fixed inset-0 z-[60] bg-[#F9F7F2] flex flex-col transition-transform ${isShaking ? 'animate-shake' : ''}`}>
        <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-stone-100">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveThread(null)} className="p-1">
              <ArrowLeft size={24} className="text-stone-400" />
            </button>
            <button onClick={() => onUserClick(activeThread.participant.id)} className="flex items-center gap-3 active:opacity-60 transition-opacity">
              <div className="relative">
                <img src={activeThread.participant.avatar} className="w-10 h-10 rounded-full object-cover border border-stone-100" />
                {isMuted && (
                  <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-0.5 border-2 border-white">
                    <Moon size={8} fill="currentColor" />
                  </div>
                )}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-1.5">
                  {activeThread.participant.name}
                  {isMuted && <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">Sleeping</span>}
                </h3>
                <p className="text-[10px] text-green-500 uppercase tracking-tighter">Online</p>
              </div>
            </button>
          </div>
          
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="text-stone-400 hover:text-stone-600 p-2">
              <MoreHorizontal size={20} />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-stone-100 p-2 z-20 animate-in fade-in zoom-in-95">
                  <button onClick={() => { onUserClick(activeThread.participant.id); setShowMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-xl transition-colors">
                    <UserIcon size={16} /> Show Profile
                  </button>
                  <button 
                    onClick={handlePing}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#D64545] font-semibold hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Zap size={16} fill="currentColor" /> Give a Ping
                  </button>
                  <button 
                    onClick={() => toggleMute(activeThread.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  >
                    {isMuted ? <><Zap size={16} /> Wake up</> : <><Moon size={16} /> Put to Sleep</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-center">
            <span className="text-[9px] text-stone-300 uppercase tracking-[0.3em] font-bold">Encrypted Moment Stream</span>
          </div>
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.senderId === CURRENT_USER.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-3xl text-sm shadow-sm leading-relaxed ${m.senderId === CURRENT_USER.id ? 'bg-[#D64545] text-white rounded-tr-none' : 'bg-white text-stone-700 rounded-tl-none border border-stone-50'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white/50 backdrop-blur-xl border-t border-stone-100 flex items-center gap-3">
          <button className="text-stone-400 hover:text-[#D64545] transition-colors p-2">
            <Paperclip size={20} />
          </button>
          <input 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-1 bg-white border border-stone-100 rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-red-50 transition-all outline-none"
            placeholder="Message friend..."
          />
          <button 
            onClick={() => {
              if(!msg) return;
              setMessages([...messages, { id: Date.now().toString(), senderId: CURRENT_USER.id, text: msg, timestamp: new Date() }]);
              setMsg('');
            }}
            className="w-12 h-12 bg-[#D64545] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-50"
            disabled={!msg}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[#F9F7F2] flex flex-col pb-24">
      <header className="px-6 pt-12 pb-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-stone-400 hover:text-stone-800 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-serif italic text-stone-800">Direct Messages</h2>
          <div className="w-10" />
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#D64545] transition-colors" size={18} />
          <input 
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-100 rounded-2xl py-3 pl-12 pr-10 text-sm focus:ring-2 focus:ring-red-50 outline-none transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500">
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-8">
        {filteredChats.length > 0 ? (
          filteredChats.map(chat => {
            const isMuted = mutedThreads.has(chat.id);
            return (
              <button 
                key={chat.id} 
                onClick={() => setActiveThread(chat)}
                className={`w-full bg-white p-4 rounded-3xl border border-stone-100 flex items-center gap-4 text-left shadow-sm hover:shadow-md transition-all active:scale-[0.98] ${isMuted ? 'opacity-60' : ''}`}
              >
                <div className="relative shrink-0">
                  <img src={chat.participant.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  {chat.unread && !isMuted && <div className="absolute top-0 right-0 w-4 h-4 bg-[#D64545] rounded-full border-2 border-white" />}
                  {isMuted && <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1 border-2 border-white"><Moon size={8} fill="currentColor" /></div>}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-semibold text-stone-800 flex items-center gap-1.5">
                      {chat.participant.name}
                      {isMuted && <span className="text-[8px] bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded-full">Snoozed</span>}
                    </h4>
                    <span className="text-[9px] text-stone-300 uppercase font-bold">2m ago</span>
                  </div>
                  <p className="text-sm text-stone-400 truncate leading-relaxed">{chat.lastMessage}</p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-20">
            <p className="text-stone-300 text-sm italic font-serif">No circles found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;
