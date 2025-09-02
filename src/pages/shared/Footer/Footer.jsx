import React from 'react';
import { NavLink } from 'react-router';
import Logo from '../Logo/Logo';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Community", path: "/communityPage" },
        { name: "About Us", path: "/about" },
        { name: "Trips", path: "/allTrips" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Offer Announcements", path: "/offers" },
    ];

    const socialLinks = [
        {
            name: "Twitter",
            href: "https://twitter.com/",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
            )
        },
        {
            name: "YouTube",
            href: "https://youtube.com/",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
            )
        },
        {
            name: "Facebook",
            href: "https://facebook.com/",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
            )
        },
    ];

    return (
        <footer className="bg-base-100 border-t border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 px-6 md:px-20 py-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

                {/* Logo and description */}
                <div className="flex flex-col items-start gap-3">
                    <div className='md:-ml-5 -mb-2'>
                        <Logo />
                    </div>
                    {/* <p className="font-semibold">ExploreBD Tours</p> */}
                    <div className=''>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Plan your adventure with us!</p>
                        <p className="text-xs text-gray-400">© {currentYear} - All rights reserved</p>

                    </div>
                </div>


                {/* Useful Links */}
                <div>
                    <h3 className="font-bold mb-3">Quick Links</h3>
                    <ul className="flex flex-col gap-2">
                        {navLinks.map(link => (
                            <li key={link.name} className="hover:text-primary dark:hover:text-primary transition-colors">
                                <NavLink to={link.path}>{link.name}</NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="font-bold mb-3">Follow Us</h3>
                    <div className="flex gap-4">
                        {socialLinks.map(link => (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                {link.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
