import React from 'react';
import { useTheme } from '../../provider/ThemeContext';

// --- Inline SVG Icons (Replacing react-icons for single-file compliance) ---

// 1. Package Icon (Suitcase/Briefcase)
const PackageIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
);

// 2. Guide Icon (User Check) - Represents selecting a verified guide
const GuideIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <path d="M22 11L14 19l-3-3"></path>
    </svg>
);

// 3. Payment Icon (Credit Card) - Represents secure payment
const PaymentIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
);

// --- Data based on ExploreBD features: Book Package, Select Guide, Payment ---
const stepsData = [
    {
        icon: <PackageIcon className="w-6 h-6" />,
        title: "1. Select & Book Your Package",
        description: "Explore our curated travel packages. Filter by destination, duration, and activity, and book your chosen trip directly on the platform.",
        color: 'bg-emerald-500',
        id: 'book'
    },
    {
        icon: <GuideIcon className="w-6 h-6" />,
        title: "2. Choose Your Expert Guide",
        description: "Personalize your journey by selecting an experienced, verified local guide based on their profile, reviews, and specialized knowledge.",
        color: 'bg-indigo-500',
        id: 'guide'
    },
    {
        icon: <PaymentIcon className="w-6 h-6" />,
        title: "3. Complete Secure Payment",
        description: "Finalize your reservation instantly with our secured payment gateway, supporting all major cards and local payment methods.",
        color: 'bg-rose-500',
        id: 'pay'
    },
];



const HowItWorksSection = () => {
    
    return (
        <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900 font-sans  flex items-center">
            <div className="max-w-6xl mx-auto px-4 w-full">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-3">
                        Your Adventure in 3 Simple Steps
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Seamlessly plan, book, and enjoy your journey in Bangladesh with ExploreBD's integrated process.
                    </p>
                </div>

                {/* Timeline Container */}
                <div className="relative flex flex-col items-center">

                    {/* Central Vertical Line (Visible on all sizes, thicker on desktop) */}
                    <div className="absolute top-0 left-0 sm:left-1/2 w-0.5 sm:w-1 h-full bg-gray-200 dark:bg-gray-700 transform sm:-translate-x-1/2 rounded-full"></div>

                    {stepsData.map((step, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <div
                                key={step.id}
                                className={`w-full relative flex items-center py-6 sm:py-10 ${isEven ? 'sm:justify-start' : 'sm:justify-end'}`}
                            >

                                {/* Step Card (Main content) */}
                                <div
                                    className={`w-full sm:w-1/2 p-6 md:p-8 rounded-xl border-4 border-transparent shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-indigo-400/50 transform hover:-translate-y-1 bg-white dark:bg-gray-800 ${isEven ? 'sm:pr-12' : 'sm:pl-12'}`}
                                >
                                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Timeline Dot (The main visual node) */}
                                <div
                                    className={`absolute z-10 w-14 h-14 rounded-full flex items-center justify-center border-4 border-gray-50 dark:border-gray-900 shadow-xl text-white transition-transform duration-300 group cursor-pointer ${step.color} 
                                        ${isEven ? 'left-0 sm:left-1/2 sm:-translate-x-1/2' : 'left-0 sm:left-1/2 sm:-translate-x-1/2'}
                                    `}
                                >
                                    {/* Icon within the dot */}
                                    <div className='transform group-hover:scale-110 transition-transform'>
                                        {step.icon}
                                    </div>
                                </div>

                                {/* Tail Connector (Hidden on mobile, visible on desktop to connect card to line) */}
                                <div className={`hidden sm:block absolute top-1/2 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full transition-opacity duration-300 
                                    ${isEven ? 'right-0 w-[50%] opacity-100' : 'left-0 w-[50%] opacity-100'}
                                    `}>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

// Main App component to handle setup and rendering
const App = () => {
    // Injecting Tailwind config for dynamic classes like 'shadow-3xl' and custom font
    const colorConfig = `
        <script>
            tailwind.config = {
                darkMode: 'class',
                theme: {
                    extend: {
                        colors: {
                            primary: '#3B82F6', 
                        },
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                }
            }
        </script>
    `;

    // State for Dark Mode Toggling
    const [isDarkMode, setIsDarkMode] = React.useState(true);
const { theme, toggleTheme } = useTheme();

    // Effect to apply dark mode class to the HTML element
    React.useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        
        <>
            {/* Must use dangerouslySetInnerHTML to load Tailwind config */}
            <div dangerouslySetInnerHTML={{ __html: colorConfig }} />

            {/* Theme Toggle Button */}
            <button
                onClick={() => toggleTheme(!theme)}
                className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 shadow-xl transition-colors font-semibold text-sm"
                aria-label="Toggle theme"
            >
                {theme ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>

            <HowItWorksSection />
        </>
    );
};

export default App;
