
import React, { useState, useRef } from 'react';
import { Camera, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthViewProps {
  onComplete: (userData: any) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    photo: 'https://picsum.photos/id/64/200/200',
    agreed: false
  });
  const [showLegal, setShowLegal] = useState<'tc' | 'privacy' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.agreed && formData.name && formData.email) {
      onComplete(formData);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const LegalModal = ({ title, content }: { title: string, content: string }) => (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[40px] max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xl font-serif italic text-stone-800">{title}</h3>
          <button onClick={() => setShowLegal(null)} className="p-2 bg-stone-50 rounded-full text-stone-400">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 text-sm text-stone-500 leading-relaxed space-y-4">
          <p className="font-bold text-stone-800 uppercase tracking-widest text-[10px]">Apple App Store Compliance</p>
          <p>{content}</p>
          <p><strong>UGC Policy:</strong> Avenue has zero tolerance for objectionable content or abusive users. Users who violate these terms will be blocked and their accounts may be terminated immediately. We provide tools for users to report and block any content that makes them uncomfortable.</p>
          <p><strong>Reporting Content:</strong> Every moment shared includes reporting tools to ensure a safe environment for everyone in your circle.</p>
          <p><strong>Privacy:</strong> We do not sell your data. Your (Moments) are visible only to the people you explicitly add to your Circle.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#F9F7F2] flex flex-col p-8 overflow-y-auto">
      <div className="max-w-sm mx-auto w-full py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-serif italic text-stone-800 mb-2">Create Account</h1>
          <p className="text-stone-400 text-xs uppercase tracking-[0.2em]">Start your Avenue journey</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
              <div 
                onClick={handlePhotoClick}
                className="relative cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img 
                  src={formData.photo} 
                  className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover" 
                  alt="Profile" 
                />
                <button 
                  type="button" 
                  className="absolute bottom-0 right-0 bg-[#D64545] text-white p-2.5 rounded-full border-2 border-white shadow-lg active:scale-90 transition-transform"
                >
                  <Camera size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-4 mb-1 block">Full Name</label>
              <input 
                required
                className="w-full bg-white border border-stone-100 rounded-3xl px-6 py-4 text-sm focus:ring-2 focus:ring-red-50 outline-none transition-all"
                placeholder="Julian Casablancas"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-4 mb-1 block">Email Address</label>
              <input 
                required
                type="email"
                className="w-full bg-white border border-stone-100 rounded-3xl px-6 py-4 text-sm focus:ring-2 focus:ring-red-50 outline-none transition-all"
                placeholder="julian@avenue.app"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold ml-4 mb-1 block">Date of Birth</label>
              <input 
                required
                type="date"
                className="w-full bg-white border border-stone-100 rounded-3xl px-6 py-4 text-sm focus:ring-2 focus:ring-red-50 outline-none transition-all"
                value={formData.dob}
                onChange={e => setFormData({...formData, dob: e.target.value})}
              />
            </div>
          </div>

          <div className="py-4 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="hidden" 
                checked={formData.agreed}
                onChange={e => setFormData({...formData, agreed: e.target.checked})}
              />
              <div className={`mt-1 shrink-0 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${formData.agreed ? 'bg-[#D64545] border-[#D64545]' : 'border-stone-200 bg-white'}`}>
                {formData.agreed && <CheckCircle2 size={14} className="text-white" />}
              </div>
              <p className="text-[11px] text-stone-500 leading-normal">
                I agree to the <button type="button" onClick={() => setShowLegal('tc')} className="text-[#D64545] font-bold underline">Terms & Conditions</button> and <button type="button" onClick={() => setShowLegal('privacy')} className="text-[#D64545] font-bold underline">Privacy Policy</button>, including the Apple UGC safety guidelines.
              </p>
            </label>
          </div>

          <button
            type="submit"
            disabled={!formData.agreed}
            className="w-full py-5 bg-[#D64545] text-white rounded-[32px] font-bold text-lg shadow-xl shadow-red-100 disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all"
          >
            Create My Ave
          </button>
        </form>

        <footer className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-stone-300">
            <ShieldCheck size={14} />
            <span className="text-[9px] uppercase tracking-[0.2em] font-black">Secure Personal Network</span>
          </div>
        </footer>
      </div>

      {showLegal === 'tc' && (
        <LegalModal 
          title="Terms & Conditions" 
          content="By using Avenue, you agree to foster a safe and respectful environment. You must not post illegal, harmful, or abusive content. Users are responsible for their own generated content. Account deletion can be requested via settings at any time. We strictly enforce Apple's safety guidelines regarding User Generated Content." 
        />
      )}
      {showLegal === 'privacy' && (
        <LegalModal 
          title="Privacy Policy" 
          content="Your privacy is paramount. We do not track your activity across other apps. Your location and (Moments) are shared only with your approved Circle. We use standard encryption to protect your direct messages and never sell your personal metadata." 
        />
      )}
    </div>
  );
};

export default AuthView;
