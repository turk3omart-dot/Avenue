
import React, { useState } from 'react';
import { Moment, ReactionType } from '../types';
import { 
  Music, MapPin, Moon, Sun, Camera, Quote, 
  MessageCircle, Send, Smile as LucideSmile, Users, Heart
} from 'lucide-react';
import { CURRENT_USER, MOOD_EMOJIS } from '../constants';

// Custom SVG Emojis matching the image aesthetics exactly
const AvenueEmoji: React.FC<{ type: ReactionType; size?: number }> = ({ type, size = 32 }) => {
  const yellow = "#FDF08A";
  const brown = "#5D4037";
  const red = "#E53935";

  switch (type) {
    case 'smile':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" fill={yellow} />
          <circle cx="13" cy="16" r="2.8" fill={brown} />
          <circle cx="27" cy="16" r="2.8" fill={brown} />
          <path d="M12 25C12 25 15 31 20 31C25 31 28 25 28 25" stroke={brown} strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      );
    case 'laugh':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" fill={yellow} />
          <circle cx="13.5" cy="15.5" r="3.2" fill={brown} />
          <path d="M23.5 16C23.5 16 26.5 13 30.5 16.5" stroke={brown} strokeWidth="3" strokeLinecap="round" />
          <path d="M11 22H29C29 22 29 32 20 32C11 32 11 22 11 22Z" fill={brown} />
        </svg>
      );
    case 'wow':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" fill={yellow} />
          <circle cx="13.5" cy="16" r="3.2" fill={brown} />
          <circle cx="26.5" cy="16" r="3.2" fill={brown} />
          <circle cx="20" cy="29" r="5" fill={brown} />
        </svg>
      );
    case 'sad':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" fill={yellow} />
          <circle cx="13" cy="16" r="3.2" fill={brown} />
          <circle cx="27" cy="16" r="3.2" fill={brown} />
          <path d="M28 31C28 31 25 25 20 25C15 25 12 31 12 31" stroke={brown} strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      );
    case 'love':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" fill={red} />
          <path d="M20 30L18.55 28.6818C13.4 24.0091 10 20.9273 10 17.1818C10 14.1 12.42 11.6818 15.5 11.6818C17.24 11.6818 18.91 12.4909 20 13.7636C21.09 12.4909 22.76 11.6818 24.5 11.6818C27.58 11.6818 30 14.1 30 17.1818C30 20.9273 26.6 24.0091 21.45 28.6909L20 30Z" fill="white" />
        </svg>
      );
    default:
      return null;
  }
};

interface MomentItemProps {
  moment: Moment;
  onComment: (momentId: string, text: string) => void;
  onReaction: (momentId: string, type: ReactionType) => void;
  onUserClick?: (userId: string) => void;
}

const MomentItem: React.FC<MomentItemProps> = ({ moment, onComment, onReaction, onUserClick }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const getUserAvatar = (userId: string) => {
    if (userId === CURRENT_USER.id) return CURRENT_USER.avatar;
    return `https://ui-avatars.com/api/?name=${userId}&background=random&color=fff`;
  };

  const getIcon = () => {
    switch (moment.type) {
      case 'music': return <Music size={14} className="text-purple-500" />;
      case 'place': return <MapPin size={14} className="text-green-500" />;
      case 'sleep': return <Moon size={14} className="text-indigo-600" />;
      case 'wake': return <Sun size={14} className="text-orange-400" />;
      case 'photo': return <Camera size={14} className="text-orange-500" />;
      case 'thought': return <Quote size={14} className="text-blue-400" />;
      case 'new_friend': return <Users size={14} className="text-red-500" />;
      default: return null;
    }
  };

  const reactionsList: ReactionType[] = ['smile', 'laugh', 'wow', 'sad', 'love'];

  const getTimeStr = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative pl-12 pr-6 mb-12 group flex flex-col justify-center min-h-[120px]">
      {/* Continuity Line */}
      <div className="absolute left-6 top-0 bottom-[-48px] w-[2px] bg-stone-200 group-last:bottom-1/2" />
      
      {/* Marker Dot - Now centered next to the card content */}
      <div className="absolute left-[21px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-stone-300 border-2 border-white z-10" />

      <div className="bg-[#D64545] p-[3px] rounded-[24px] shadow-sm transition-all hover:shadow-md overflow-hidden w-full">
        <div className="bg-white rounded-[21px] p-4">
          <div className="flex items-center gap-3 mb-3">
            <button 
              onClick={() => onUserClick?.(moment.userId)}
              className="relative shrink-0 active:scale-90 transition-transform"
            >
              <img src={moment.userAvatar} className="w-8 h-8 rounded-full border border-stone-100 object-cover" alt={moment.userName} />
            </button>
            <div className="flex-1 text-left">
              <button 
                onClick={() => onUserClick?.(moment.userId)}
                className="text-xs font-semibold text-stone-700 flex items-center gap-1.5 hover:text-[#D64545] transition-colors"
              >
                {moment.userName}
                {moment.moodAtTime && moment.moodAtTime !== 'none' && (
                  <span title={`Feeling ${moment.moodAtTime}`} className="text-sm">
                    {MOOD_EMOJIS[moment.moodAtTime]}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-1 opacity-50">
                {getIcon()}
                <span className="text-[10px] uppercase tracking-wider">{getTimeStr(moment.timestamp)}</span>
                {moment.location && <span className="text-[10px] text-stone-400 ml-1">• {moment.location}</span>}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {moment.type === 'photo' && moment.imageUrl && (
              <div className="rounded-lg overflow-hidden -mx-4 -mt-2">
                <img src={moment.imageUrl} className="w-full h-auto aspect-[4/3] object-cover" alt="Moment" />
              </div>
            )}

            {moment.type === 'new_friend' && (
              <div className="flex flex-col items-center py-6 px-4 bg-stone-50 rounded-2xl border border-stone-100 gap-4">
                <div className="flex items-center -space-x-4">
                  <button onClick={() => onUserClick?.(moment.userId)} className="relative active:scale-90 transition-transform">
                    <img src={moment.userAvatar} className="w-16 h-16 rounded-full border-4 border-white shadow-lg z-10" />
                  </button>
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center z-20 shadow-sm border border-stone-100">
                    <Heart size={20} className="text-red-500 fill-red-500" />
                  </div>
                  <button onClick={() => onUserClick?.(moment.userId)} className="relative active:scale-90 transition-transform">
                    <img src={moment.friendAvatar} className="w-16 h-16 rounded-full border-4 border-white shadow-lg z-10" />
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-stone-700 uppercase tracking-widest">A New Connection</p>
                  <p className="text-sm text-stone-500 mt-1">
                    <span className="font-bold text-stone-800">{moment.userName}</span> is now friends with <span className="font-bold text-stone-800">{moment.friendName}</span>
                  </p>
                </div>
              </div>
            )}

            {moment.content && (
              <p className={`text-stone-800 leading-relaxed ${moment.type === 'thought' ? 'text-lg font-serif italic' : 'text-sm'}`}>
                {moment.content}
              </p>
            )}

            {moment.type === 'music' && (
              <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <Music size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">{moment.songTitle}</p>
                  <p className="text-xs text-stone-500">{moment.artist} • via {moment.musicProvider || 'Avenue'}</p>
                </div>
              </div>
            )}

            {moment.type === 'sleep' && (
              <div className="space-y-2">
                <div className="text-stone-400 uppercase text-[10px] tracking-widest">Went to bed at {moment.sleepDuration}</div>
                {moment.note && <p className="text-stone-600 italic text-sm">"{moment.note}"</p>}
              </div>
            )}
          </div>

          {moment.reactions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-stone-50 flex flex-wrap gap-4 px-1">
              {moment.reactions.map(r => (
                <button key={r.id} onClick={() => onUserClick?.(r.userId)} className="relative active:scale-90 transition-transform">
                  <img 
                    src={getUserAvatar(r.userId)} 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" 
                    alt="Reacting User"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-stone-50">
                    <AvenueEmoji type={r.type} size={14} />
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-stone-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowPicker(!showPicker)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${showPicker ? 'bg-stone-200 text-stone-600' : 'bg-stone-50 text-stone-400 hover:bg-stone-100'}`}
                >
                  <LucideSmile size={18} />
                </button>

                {showPicker && (
                  <div className="absolute bottom-full left-0 mb-3 z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
                    <div className="bg-[#D64545] p-2 rounded-full shadow-2xl">
                      <div className="bg-white flex items-center gap-1 p-1 rounded-full px-4 py-3 h-14">
                        {reactionsList.map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              onReaction(moment.id, type);
                              setShowPicker(false);
                            }}
                            className="w-10 h-10 rounded-full hover:bg-stone-50 flex items-center justify-center transition-all hover:scale-125 active:scale-95"
                          >
                            <AvenueEmoji type={type} size={32} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1.5 text-stone-400 text-[10px] uppercase tracking-wider font-bold hover:text-[#D64545]"
              >
                <MessageCircle size={14} />
                {moment.comments.length} Comments
              </button>
            </div>
            
            <div className="text-[10px] text-stone-200 uppercase tracking-widest font-black italic">
              Avenue
            </div>
          </div>

          {showComments && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-stone-50/50 rounded-2xl p-4 space-y-4">
                {moment.comments.length > 0 ? (
                  moment.comments.map(c => (
                    <div key={c.id} className="flex gap-3 text-left">
                      <button onClick={() => onUserClick?.(c.userId)} className="shrink-0 active:scale-90 transition-transform">
                        <img src={c.userAvatar} className="w-7 h-7 rounded-full object-cover border border-white shadow-sm" />
                      </button>
                      <div className="flex-1 bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-[11px] border border-stone-100">
                        <div className="flex justify-between items-center mb-1">
                          <button onClick={() => onUserClick?.(c.userId)} className="font-bold text-stone-700 hover:text-[#D64545] transition-colors">{c.userName}</button>
                          <span className="text-[9px] text-stone-300">Just now</span>
                        </div>
                        <p className="text-stone-600 leading-normal">{c.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[10px] text-stone-300 py-2 italic">Be the first to comment...</p>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <input 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-stone-50 border border-stone-100 rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-[#D64545]/10 focus:bg-white transition-all outline-none"
                />
                <button 
                  onClick={() => {
                    if(!commentText) return;
                    onComment(moment.id, commentText);
                    setCommentText('');
                  }}
                  className="bg-[#D64545] text-white p-2 rounded-full shadow-sm active:scale-90"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MomentItem;
