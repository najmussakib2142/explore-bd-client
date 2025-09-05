import React, { createContext, useEffect, useState, useContext } from 'react';

// Create the ThemeContext
const ThemeContext = createContext();

// Custom hook for consuming theme
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider = ({ children }) => {

    //   const [theme, setTheme] = useState('light');

    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const systemPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedTheme || (systemPreferDark ? 'dark' : 'light');
    };

    const [theme, setTheme] = useState(getInitialTheme);


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
        document.documentElement.setAttribute('data-theme', theme); // update HTML attribute
        localStorage.setItem('theme', theme); // save user preference
    }, [theme]); // run every time 'theme' changes

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
