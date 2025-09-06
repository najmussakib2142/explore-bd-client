import React from "react";
import { NavLink } from "react-router";
import Logo from "../Logo/Logo";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Trips", path: "/allTrips" },
        { name: "Community", path: "/communityPage" },
        // { name: "Contact", path: "/contact" },
        { name: "FAQ", path: "/faq" },
    ];

    const socialLinks = [
        {
            name: "GitHub",
            href: "https://github.com/najmussakib2142?tab=repositories",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 
          5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577
          0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61
          -.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729
          1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.304
          3.495.997.108-.776.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93
          0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176
          0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3-.404c1.02.005 2.045.138
          3 .404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.874.12 3.176
          .77.84 1.236 1.91 1.236 3.22 0 4.61-2.804 5.624-5.475
          5.92.43.37.823 1.102.823 2.222 0 1.606-.015 2.896-.015 
          3.286 0 .317.216.687.825.57C20.565 22.092 24 
          17.592 24 12.297c0-6.627-5.373-12-12-12z" />
                </svg>
            ),
        },
        {
            name: "WhatsApp",
            href: "https://api.whatsapp.com/send/?phone=8801736007474&text=Hello,+I+want+to+know+more+about+ExploreBD+packages&type=phone_number&app_absent=0",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 
          5.338-11.891 11.893-11.891 3.181.001 6.167 
          1.24 8.413 3.488 2.245 2.248 3.481 
          5.236 3.48 8.414-.003 6.557-5.338 
          11.893-11.893 11.893-1.99-.001-3.951-.5-5.688-1.448l-6.305 
          1.653zm6.597-3.807c1.676.995 3.276 1.591 5.392 
          1.592 5.448 0 9.886-4.434 
          9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 
          0-9.887 4.434-9.889 9.884-.001 2.225.651 
          3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.668.149-.198.297-.767.967-.94 
          1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.668-1.611-.916-2.206-.242-.579-.487-.5-.668-.51l-.57-.01c-.198 
          0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 
          3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 
          1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 
          2.006-1.413.248-.694.248-1.289.173-1.413z" />
                </svg>
            ),
        },
        {
            name: "Facebook",
            href: "https://www.facebook.com/NajmusSinatra/",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                >
                    <path d="M9 8H6v4h3v12h5V12h3.642l.358-4H14V6.333C14 5.378 14.192 
          5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                </svg>
            ),
        },
        {
            name: "LinkedIn",
            href: "https://www.linkedin.com/in/s-m-najmus-sakib-256472248/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.852-3.037-1.853 
                0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.5h3.414v1.569h.049c.477-.9 
                1.637-1.852 3.369-1.852 3.601 0 4.268 2.37 4.268 
                5.455v6.328zm-14.693-13.229c-1.144 
                0-2.068-.926-2.068-2.068 0-1.143.924-2.068 
                2.068-2.068s2.068.925 
                2.068 2.068c0 1.142-.924 2.068-2.068 
                2.068zm1.777 13.229h-3.554v-11.5h3.554v11.5zm16.469-20.452h-22.916c-.828 
                0-1.5.672-1.5 1.5v21c0 
                .828.672 1.5 1.5 1.5h22.916c.828 
                0 1.5-.672 1.5-1.5v-21c0-.828-.672-1.5-1.5-1.5z"/>
                </svg>
            )
        },
    ];

    return (
        <footer className="bg-base-100  border-t border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 px-6 md:px-20 py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3  gap-10">

                {/* Logo + Description */}
                <div className="flex flex-col gap-3">
                    <div className="md:-ml-5 -mb-2">
                        <Logo />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Plan your adventure with ExploreBD — discover the best trips,
                        communities, and experiences across Bangladesh.
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        © {currentYear} ExploreBD. All rights reserved.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="md:pl-9">
                    <h3 className="font-bold  mb-3">Quick Links</h3>
                    <ul className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <li
                                key={link.name}
                                className="hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                <NavLink to={link.path}>{link.name}</NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="font-bold pt-2 mb-3">Connect with Us</h3>
                    <div className="flex gap-4">
                        {socialLinks.map((link) => (
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
                    <div className="pt-6">
                        <h3 className="font-semibold mb-2 text-lg">Contact</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            📍 Dhaka, Bangladesh
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            📞 +880 1736 007474
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            ✉️ najmussakib2142@email.com
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
