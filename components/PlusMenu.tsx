
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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      {/* Overlay for closing */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={toggleMenu}
        />
      )}

      {/* Menu Items */}
      <div className="relative flex justify-center items-center">
        {menuItems.map((item, index) => {
          // Spread items in a semi-circle around the button
          const totalItems = menuItems.length;
          const startAngle = 180; // Start from top-left
          const endAngle = 360;   // End at top-right
          const angleStep = (endAngle - startAngle) / (totalItems - 1);
          const angle = (startAngle + (index * angleStep)) * (Math.PI / 180);
          
          const radius = isOpen ? 100 : 0;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <button
              key={item.label}
              onClick={() => {
                onSelect(item.type);
                setIsOpen(false);
              }}
              className={`absolute transition-all duration-300 ease-out flex items-center justify-center w-12 h-12 rounded-full shadow-lg text-white ${item.color} ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <item.icon size={20} />
            </button>
          );
        })}

        {/* The Main Button */}
        <button
          onClick={toggleMenu}
          className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300 bg-[#D64545] text-white ${isOpen ? 'rotate-45 scale-110' : 'rotate-0'}`}
        >
          <Plus size={32} />
        </button>
      </div>
    </div>
  );
};

export default PlusMenu;
