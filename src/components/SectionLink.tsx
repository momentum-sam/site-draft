import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SectionLinkProps {
    href: string;
    children: React.ReactNode;
    theme?: 'light' | 'dark';
    className?: string;
}

/**
 * Reusable section link component with consistent styling across the application.
 * Supports both light and dark themes with appropriate color schemes.
 * Light theme: Gray underline that fills with black on hover
 * Dark theme: Underline fills from left to right with #FDB447 on hover
 */
export const SectionLink: React.FC<SectionLinkProps> = ({
    href,
    children,
    theme = 'dark',
    className = ''
}) => {
    const baseClasses = "group inline-flex items-center gap-2 text-lg font-medium relative pb-1";

    const textClasses = theme === 'dark'
        ? "text-white group-hover:text-[#FDB447]"
        : "text-[#1a1a1a]";

    const iconClasses = theme === 'dark'
        ? "text-white group-hover:text-[#FDB447]"
        : "text-gray-400 group-hover:text-[#1a1a1a]";

    return (
        <a
            href={href}
            className={`${baseClasses} ${textClasses} ${className}`}
        >
            {/* Underline base layer */}
            <span
                className={`absolute bottom-0 left-0 right-0 h-[1px] ${theme === 'dark' ? 'bg-white' : 'bg-gray-400'
                    }`}
            />

            {/* Underline fill layer that animates on hover */}
            <span
                className={`absolute bottom-0 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${theme === 'dark' ? 'bg-[#FDB447]' : 'bg-[#1a1a1a]'
                    }`}
            />

            {children}
            <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-all duration-300 ${iconClasses}`} />
        </a>
    );
};
