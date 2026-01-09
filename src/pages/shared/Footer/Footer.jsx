import React, { useState } from "react";
import { NavLink } from "react-router";
import Logo from "../Logo/Logo";
import {
    FaFacebookF,
    FaWhatsapp,
    FaLinkedinIn,
    FaInstagram,
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt
} from "react-icons/fa";
import Swal from "sweetalert2";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            Swal.fire({
                title: "Subscription Pending!",
                text: "Thank you for your interest! Our newsletter is launching soon, and we've added you to the waitlist.",
                icon: "success",
                iconColor: "#10b981", // Matches a green primary color
                confirmButtonText: "Awesome",
                confirmButtonColor: "#10b981",
                background: document.documentElement.classList.contains('dark') ? '#111827' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#111827',
                customClass: {
                    popup: 'rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl',
                    confirmButton: 'px-8 py-2 rounded-lg font-semibold'
                }
            }); setEmail("");
        }
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Trips", path: "/allTrips" },
        { name: "Community", path: "/communityPage" },
        { name: "FAQ", path: "/faq" },
    ];

    const socialLinks = [
        { name: "Facebook", href: "https://www.facebook.com/NajmusSinatra/", icon: <FaFacebookF /> },
        { name: "WhatsApp", href: "https://wa.me/8801736007474", icon: <FaWhatsapp /> },
        { name: "LinkedIn", href: "https://www.linkedin.com/in/s-m-najmus-sakib-256472248/", icon: <FaLinkedinIn /> },
        { name: "Instagram", href: "#", icon: <FaInstagram /> },
    ];

    return (
        <footer className="bg-[#f8fafc] dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6  pt-12 pb-12 lg:px-16">

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    {/* Column 1: Brand & Identity */}
                    <div className="space-y-6">
                        <Logo />
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            ExploreBD is your premier gateway to discovering the hidden gems of Bangladesh.
                            From the mangroves of Sundarbans to the peaks of Sajek.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
                                    aria-label={link.name}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Navigation */}
                    <div className="lg:pl-8">
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-7 text-gray-900 dark:text-gray-100">
                            Quick Links
                        </h3>
                        <ul className="space-y-4">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <NavLink
                                        to={link.path}
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact Details */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-7 text-gray-900 dark:text-gray-100">
                            Get in Touch
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <FaMapMarkerAlt className="mt-1 text-primary shrink-0" />
                                <span>Dhaka, Bangladesh</span>
                            </li>
                            <li>
                                <a href="tel:+8801736007474" className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    <FaPhoneAlt className="text-primary shrink-0" />
                                    <span>+880 1736 007474</span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:najmussakib2142@gmail.com" className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    <FaEnvelope className="text-primary shrink-0" />
                                    <span>najmussakib2142@gmail.com</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-7 text-gray-900 dark:text-gray-100">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Subscribe for exclusive trip offers and travel guides.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="px-4 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none"
                            />
                            <button className="bg-gray-900 dark:bg-primary hover:bg-black dark:hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg transition-all text-sm shadow-md active:scale-[0.98]">
                                Subscribe Now
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar: Trust & Legal */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8">

                    <div className="order-2 md:order-1 text-center md:text-left">
                        <p className="text-xs text-gray-500 mb-1">
                            © {currentYear} ExploreBD. All rights reserved.
                        </p>
                        {/* <div className="flex gap-4 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <span>•</span>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        </div> */}
                    </div>

                    {/* Trusted Payment Partners */}
                    <div className="order-1  md:order-2 flex flex-col items-center justify-between md:items-end gap-2 md:gap-3">
                        <div className="flex items-center justify-between gap-5 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment Partners:</span>

                            <span className="font-bold italic text-sm text-blue-800">VISA</span>
                            <span className="font-bold italic text-sm text-orange-600">mastercard</span>
                            <span className="font-bold italic text-sm text-pink-600">Amex</span>
                            {/* <span className="font-bold italic text-sm text-red-600">Nagad</span> */}
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;