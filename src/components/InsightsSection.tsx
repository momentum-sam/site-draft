import React from 'react';
import { SectionLink } from './SectionLink';

interface InsightCardProps {
    title: string;
    category: string;
    date: string;
    image?: string;
    isLogo?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, category, date, image, isLogo }) => {
    return (
        <div className="group relative flex flex-col md:flex-row gap-6 p-6 md:px-8 lg:px-14 [@media(min-width:1656px)]:px-8 rounded-2xl bg-[#111] hover:bg-[#1a1a1a] transition-colors duration-300 cursor-pointer border border-white/5">
            {/* Text content - stacks on top on mobile, left side on desktop */}
            <div className="flex flex-col justify-between md:max-w-md">
                <h3 className="text-xl md:text-2xl font-medium text-white group-hover:text-[#FDB447] transition-colors mb-4 md:mb-0">
                    {title}
                </h3>

                <div className="flex flex-col gap-1 text-sm text-gray-400">
                    <span className="font-medium text-white">{category}</span>
                    <span>{date}</span>
                </div>
            </div>

            {/* Spacer to push image to the far right on desktop */}
            <div className="hidden md:block flex-1"></div>

            {/* Image - full width on mobile, fixed size on desktop (16:9 ratio) */}
            {image && (
                <div className="relative w-full md:w-[448px] h-[200px] md:h-[252px] rounded-lg overflow-hidden bg-[#000] md:flex-shrink-0">
                    {isLogo ? (
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <img src={image} alt={title} className="max-w-full max-h-full object-contain" />
                        </div>
                    ) : (
                        <img src={image} alt={title} className="w-full h-full object-cover" />
                    )}
                </div>
            )}
        </div>
    );
};

export const InsightsSection: React.FC = () => {
    const insights = [
        {
            title: "The UX of AI: How to Design for AI-Powered Experiences",
            category: "Cognitive Design",
            date: "05.14.2025",
            image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&auto=format&fit=crop&q=60", // Placeholder for stage
            isLogo: false
        },
        {
            title: "Momentum Design Lab becomes HTEC Momentum",
            category: "Announcement",
            date: "05.14.2025",
            image: "https://placehold.co/400x200/000000/FFFFFF/png?text=HTEC+Momentum", // Placeholder for logo
            isLogo: true
        },
        {
            title: "Winner: iF Design Award 2025",
            category: "Announcement",
            date: "05.14.2025",
            image: "https://placehold.co/400x200/E60012/FFFFFF/png?text=iF+DESIGN", // Placeholder for iF logo
            isLogo: true
        },
        {
            title: "Understanding the value of cognitive jobs in AI-augmented design",
            category: "Cognitive Design",
            date: "05.14.2025",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60", // Placeholder for abstract
            isLogo: false
        }
    ];

    return (
        <section className="relative z-20 py-24 rounded-t-[32px]" style={{ backgroundColor: 'var(--bg-dark)' }} data-theme="dark">
            {/* Text content follows standard grid */}
            <div className="px-5 md:px-10 lg:px-12">
                <div className="max-w-[1640px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                        <h2 className="lg:w-1/2 text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight text-white">
                            We're continuing to shape what's next
                        </h2>

                        <SectionLink href="#" theme="dark">
                            View our insights
                        </SectionLink>
                    </div>
                </div>
            </div>

            {/* Cards with 8px padding on all screens, expanding beyond container only when max-width is reached */}
            <div className="px-2">
                <div className="max-w-[1640px] mx-auto">
                    <div className="grid grid-cols-1 gap-2 [@media(min-width:1656px)]:-mx-2">
                        {insights.map((insight, index) => (
                            <InsightCard key={index} {...insight} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
