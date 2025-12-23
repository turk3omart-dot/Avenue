
import React, { useState } from 'react';
import { Plus, Camera, Music, Type, Moon, MapPin, X } from 'lucide-react';

interface PlusMenuProps {
  onSelect: (type: string) => void;
}

const PlusMenu: React.FC<PlusMenuProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Music, label: 'Music', color: 'bg-purple-500', type: 'music' },
    { icon: Type, label: 'Thought', color: 'bg-blue-400', type: 'thought' },
    { icon: Camera, label: 'Photo', color: 'bg-orange-400', type: 'photo' },
    { icon: MapPin, label: 'Place', color: 'bg-green-500', type: 'place' },
    { icon: Moon, label: 'Sleep', color: 'bg-indigo-700', type: 'sleep' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-[26px] left-1/2 -translate-x-1/2 z-[110]">
      {/* Overlay for closing */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-[-1]"
          style={{ width: '100vw', height: '100vh', left: '-50vw', top: '-100vh' }}
          onClick={toggleMenu}
        />
      )}

      {/* Menu Items */}
      <div className="relative flex justify-center items-center">
        {menuItems.map((item, index) => {
          // Spread items in a semi-circle around the button
          const totalItems = menuItems.length;
          const startAngle = 200; // Adjusted for a nice arc
          const endAngle = 340;   
          const angleStep = (endAngle - startAngle) / (totalItems - 1);
          const angle = (startAngle + (index * angleStep)) * (Math.PI / 180);
          
          const radius = isOpen ? 110 : 0;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <button
              key={item.label}
              onClick={() => {
                onSelect(item.type);
                setIsOpen(false);
              }}
              className={`absolute transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) flex flex-col items-center gap-1 group ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <div className={`w-12 h-12 rounded-full shadow-xl text-white ${item.color} flex items-center justify-center border-2 border-white/20 active:scale-90 transition-transform`}>
                <item.icon size={20} />
              </div>
              <span className="text-[8px] font-bold text-white uppercase tracking-widest drop-shadow-md">{item.label}</span>
            </button>
          );
        })}

        {/* The Main Button */}
        <button
          onClick={toggleMenu}
          className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-full shadow-[0_8px_25px_-5px_rgba(214,69,69,0.5)] transition-all duration-500 bg-[#D64545] text-white border-2 border-white/30 ${isOpen ? 'rotate-[135deg] scale-110 shadow-none' : 'rotate-0 hover:scale-105 active:scale-95'}`}
        >
          <Plus size={32} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default PlusMenu;
