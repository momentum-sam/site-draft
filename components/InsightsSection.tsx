import React from 'react';
import { ArrowRight } from 'lucide-react';

interface InsightCardProps {
    title: string;
    category: string;
    date: string;
    image?: string;
    isLogo?: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, category, date, image, isLogo }) => {
    return (
        <div className="group relative flex flex-col gap-4 p-6 rounded-2xl bg-[#111] hover:bg-[#1a1a1a] transition-colors duration-300 cursor-pointer border border-white/5">
            <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-medium text-white mb-8 group-hover:text-[#FDB447] transition-colors">
                    {title}
                </h3>
            </div>

            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1 text-sm text-gray-400">
                    <span className="font-medium text-white">{category}</span>
                    <span>{date}</span>
                </div>

                {image && (
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-[#000]">
                        {isLogo ? (
                            <div className="w-full h-full flex items-center justify-center p-2">
                                <img src={image} alt={title} className="max-w-full max-h-full object-contain" />
                            </div>
                        ) : (
                            <img src={image} alt={title} className="w-full h-full object-cover" />
                        )}
                    </div>
                )}
            </div>
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
        <section className="relative py-24 px-8 md:px-16 bg-[#030303]" data-theme="dark">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <h2 className="lg:w-1/2 text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight text-white">
                        We’re continuing to shape what’s next
                    </h2>

                    <a
                        href="#"
                        className="group flex items-center gap-2 text-lg text-white hover:text-[#FDB447] transition-colors pb-2 border-b border-transparent hover:border-[#FDB447]"
                    >
                        View our insights
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-1 gap-1">
                    {insights.map((insight, index) => (
                        <InsightCard key={index} {...insight} />
                    ))}
                </div>
            </div>
        </section>
    );
};
