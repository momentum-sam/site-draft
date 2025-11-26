import React, { useState, useEffect } from 'react';
import LogoLight from '../assets/logo/Logo-Light.svg';
import LogoDark from '../assets/logo/Logo-Dark.svg';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    isDark: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, isDark }) => (
    <a
        href={href}
        className={`relative group py-1 transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'
            }`}
    >
        {children}
        <span
            className={`absolute bottom-0 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${isDark ? 'bg-[#FDB447]' : 'bg-black'
                }`}
        />
    </a>
);

export const Header: React.FC = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Get all sections with data-theme attribute
            const sections = document.querySelectorAll('[data-theme]');

            // Check which section the top of the viewport is in
            for (const section of Array.from(sections)) {
                const rect = section.getBoundingClientRect();

                // If the top of the section is at or above the top of the viewport
                // and the bottom is below the top of the viewport
                if (rect.top <= 0 && rect.bottom > 0) {
                    const sectionTheme = section.getAttribute('data-theme') as 'dark' | 'light';
                    setTheme(sectionTheme);
                    break;
                }
                // If we're at the very top of the page
                if (currentScrollY === 0) {
                    setTheme('dark');
                    break;
                }
            }

            // Show/hide header based on scroll direction
            if (currentScrollY < lastScrollY) {
                // Scrolling up
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down and past 100px
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        // Initial check
        handleScroll();

        // Listen to scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const isDark = theme === 'dark';

    return (
        <header
            className={`fixed left-0 w-full px-5 md:px-10 lg:px-12 py-6 flex items-center justify-between z-40 pointer-events-none transition-all duration-500 ${isVisible ? 'top-0' : '-top-32'
                }`}
            style={{
                backgroundColor: isDark ? 'rgba(5, 5, 5, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}
        >
            <div className="flex items-center gap-20">
                <a href="#" className="flex items-center pointer-events-auto pb-2">
                    <img
                        src={isDark ? LogoLight : LogoDark}
                        alt="HTEC Momentum"
                        className="h-5 transition-opacity duration-500"
                    />
                </a>
                <nav className="hidden md:flex gap-8 text-sm font-medium pointer-events-auto">
                    <NavLink href="#" isDark={isDark}>WORK</NavLink>
                    <NavLink href="#" isDark={isDark}>CAPABILITIES</NavLink>
                    <NavLink href="#" isDark={isDark}>CAREERS</NavLink>
                    <NavLink href="#" isDark={isDark}>INSIGHTS</NavLink>
                </nav>
            </div>
            <div className="hidden md:flex items-center gap-4 pointer-events-auto">
                <a
                    href="https://clutch.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-3 border rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-500 ${isDark
                        ? 'border-white text-white hover:bg-white hover:text-black'
                        : 'border-black text-black hover:bg-black hover:text-white'
                        }`}
                >
                    Find us ranked #1 on Clutch
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
                <a
                    href="#contact"
                    className="px-6 py-3 bg-[#FDB447] text-black rounded-full text-sm font-medium hover:bg-[#fda726] transition-all"
                >
                    Let's talk
                </a>
            </div>
        </header>
    );
};
