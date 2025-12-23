
import React, { useState } from 'react';
import { ArrowRight, Heart, Shield, Users } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Avenue",
      description: "A space for you and your inner circle. No ads, no noise, just life's real moments.",
      icon: <Heart className="text-red-400 w-12 h-12" />,
      image: "https://images.unsplash.com/photo-1516733968668-dbdce39c46ef?q=80&w=400&h=400&auto=format&fit=crop"
    },
    {
      title: "Intimacy by Design",
      description: "We limit you to 150 friends. Curate your circle with the people who truly matter.",
      icon: <Users className="text-blue-400 w-12 h-12" />,
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&h=400&auto=format&fit=crop"
    },
    {
      title: "(Moments)",
      description: "Chronicle your day—from the songs you love to the moments you sleep. Your story is yours alone.",
      icon: <Shield className="text-green-400 w-12 h-12" />,
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=400&h=400&auto=format&fit=crop"
    }
  ];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#F9F7F2] flex flex-col p-8 overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
        <div className="mb-8 w-64 h-64 rounded-[40px] overflow-hidden shadow-2xl rotate-3">
          <img src={steps[step].image} className="w-full h-full object-cover" alt="Onboarding" />
        </div>
        
        <div className="mb-6">{steps[step].icon}</div>
        
        <h1 className="text-3xl font-serif mb-4 text-[#4A443F]">{steps[step].title}</h1>
        <p className="text-stone-500 leading-relaxed mb-8">
          {steps[step].description}
        </p>

        <div className="flex gap-2 mb-12">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#D64545]' : 'w-2 bg-stone-200'}`} />
          ))}
        </div>
      </div>

      <button
        onClick={next}
        className="w-full py-5 bg-[#D64545] text-white rounded-3xl shadow-xl shadow-red-200 flex items-center justify-center gap-2 font-semibold text-lg hover:bg-red-600 transition-colors active:scale-[0.98]"
      >
        {step === steps.length - 1 ? 'Start Journey' : 'Continue'}
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default Onboarding;
