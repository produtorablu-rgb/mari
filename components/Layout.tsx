
import React from 'react';
import { SALON_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'CLIENT' | 'ADMIN';
  onToggleView: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onToggleView }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#121212] border-b border-[#AA771C]/30 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black flex items-center justify-center shadow-lg">
                <span className="text-[#D4AF37] font-bold text-2xl tracking-tighter">MP</span>
            </div>
            <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{SALON_NAME}</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mt-[-4px]">Elegância & Estilo</p>
            </div>
          </div>
          <button 
            onClick={onToggleView}
            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] border border-gray-700 px-4 py-2 rounded-full transition-all"
          >
            {activeView === 'CLIENT' ? 'Área Restrita' : 'Ver Agenda'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>

      <footer className="bg-[#121212] border-t border-[#AA771C]/20 py-10 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
             <div className="w-10 h-1 border-t-2 border-[#D4AF37]"></div>
          </div>
          <p className="text-[#D4AF37] font-serif text-lg italic mb-2">{SALON_NAME}</p>
          <p className="text-gray-400 text-sm italic">Onde sua beleza é nossa arte.</p>
        </div>
      </footer>
    </div>
  );
};
