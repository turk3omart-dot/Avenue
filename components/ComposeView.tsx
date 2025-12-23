
import React, { useState } from 'react';
import { X, Camera, Music, Type, Moon, MapPin, Paperclip, Check } from 'lucide-react';
import { MomentType } from '../types';

interface ComposeViewProps {
  type: MomentType;
  onClose: () => void;
  onPost: (data: any) => void;
}

const ComposeView: React.FC<ComposeViewProps> = ({ type, onClose, onPost }) => {
  const [content, setContent] = useState('');
  const [extra, setExtra] = useState<any>({});
  const [showMaps, setShowMaps] = useState(false);

  const getTitle = () => {
    switch(type) {
      case 'music': return 'I am listening to...';
      case 'thought': return 'I am thinking...';
      case 'photo': return 'Capturing a moment...';
      case 'place': return 'I am at...';
      case 'sleep': return 'Going to sleep...';
      default: return 'Sharing a moment...';
    }
  };

  const handlePost = () => {
    onPost({ content, ...extra });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#F9F7F2] flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onClose} className="p-2 text-stone-400">
          <X size={24} />
        </button>
        <h2 className="text-lg font-serif italic text-stone-800">{getTitle()}</h2>
        <button 
          onClick={handlePost}
          disabled={!content && !extra.imageUrl && type !== 'sleep'}
          className="bg-[#D64545] text-white px-6 py-2 rounded-full font-medium shadow-lg disabled:opacity-50"
        >
          Post
        </button>
      </div>

      <div className="flex-1 space-y-6">
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={type === 'sleep' ? "Add a sleep note..." : "What's on your mind?"}
          className="w-full bg-transparent text-xl font-serif border-none focus:ring-0 placeholder:text-stone-300 resize-none min-h-[150px]"
        />

        {/* Dynamic Fields based on Type */}
        <div className="space-y-4">
          {type === 'music' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-white rounded-xl border border-stone-100 flex items-center justify-center gap-2 text-sm">
                  <span className="w-4 h-4 rounded-full bg-green-500" /> Spotify
                </button>
                <button className="flex-1 py-3 bg-white rounded-xl border border-stone-100 flex items-center justify-center gap-2 text-sm">
                  <span className="w-4 h-4 rounded-full bg-pink-500" /> Apple Music
                </button>
              </div>
              <input 
                placeholder="Song title and artist..."
                className="w-full p-4 bg-white rounded-xl border border-stone-100 text-sm"
                onChange={(e) => setExtra({ ...extra, songTitle: e.target.value.split(' - ')[0], artist: e.target.value.split(' - ')[1] })}
              />
            </div>
          )}

          {type === 'thought' && (
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-stone-400 text-sm bg-white p-3 rounded-xl border border-stone-100">
                <Camera size={18} /> Add Photo
              </button>
              <button className="flex items-center gap-2 text-stone-400 text-sm bg-white p-3 rounded-xl border border-stone-100">
                <Paperclip size={18} /> Attachment
              </button>
            </div>
          )}

          {type === 'sleep' && (
            <div className="p-4 bg-stone-100 rounded-2xl flex items-center justify-between">
              <span className="text-stone-500 text-sm">Time of sleep</span>
              <span className="text-stone-800 font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}

          {type === 'place' && (
            <div className="space-y-3">
              <button 
                onClick={() => setShowMaps(!showMaps)}
                className="w-full p-4 bg-white rounded-xl border border-stone-100 flex items-center gap-3 text-sm text-stone-500"
              >
                <MapPin size={18} className="text-[#D64545]" />
                {extra.location || "Search Google Maps..."}
              </button>
              {showMaps && (
                <div className="h-40 bg-stone-200 rounded-xl overflow-hidden relative">
                  <img src="https://picsum.photos/id/231/400/200" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => {
                        setExtra({...extra, location: 'The Local Cafe'});
                        setShowMaps(false);
                      }}
                      className="bg-white px-4 py-2 rounded-full text-xs shadow-xl"
                    >
                      Select "The Local Cafe"
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComposeView;
