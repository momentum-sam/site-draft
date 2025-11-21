import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 w-full p-6 md:p-10 flex items-center gap-20 z-50 mix-blend-difference pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
                <div className="w-8 h-8 border border-white rounded-full flex items-center justify-center animate-spin-slow">
                    <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="font-bold text-xl tracking-tighter">HTEC Momentum</span>
            </div>
            <nav className="hidden md:flex gap-8 text-sm font-medium pointer-events-auto">
                <a href="#" className="hover:text-blue-400 transition-colors">WORK</a>
                <a href="#" className="hover:text-blue-400 transition-colors">CAPABILITIES</a>
                <a href="#" className="hover:text-blue-400 transition-colors">CAREERS</a>
                <a href="#" className="hover:text-blue-400 transition-colors">INSIGHTS</a>
            </nav>
        </header>
    );
};
