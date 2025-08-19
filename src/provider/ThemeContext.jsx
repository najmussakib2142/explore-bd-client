import React, { createContext, useEffect, useState, useContext } from 'react';

// Create the ThemeContext
const ThemeContext = createContext();

// Custom hook for consuming theme
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState("dark"); // 👈 default is dark

    // use theme from browser preferences
    
    // const getInitialTheme = () => {
    //     const savedTheme = localStorage.getItem('theme');
    //     const systemPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    //     return savedTheme || (systemPreferDark ? 'dark' : 'light');
    // };

    // const [theme, setTheme] = useState(getInitialTheme);


    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            setTheme(savedTheme);
        } else if (systemPreferDark) {
            setTheme('dark');
        }
    }, []);

    useEffect(() => {
        const html = document.documentElement;
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
