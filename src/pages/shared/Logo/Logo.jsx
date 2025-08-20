import React from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router";

const Logo = () => {
    return (
        <Link to="/" className="flex items-center cursor-pointer select-none">
            <img
                className="h-12 hidden md:block md:-mr-3 w-auto" 
                src={logo}
                alt="ExploreBD Logo"
            />
            <h2 className="text-2xl ml-1 md:ml-0 font-bold text-primary">
                ExploreBD
            </h2>
        </Link>
    );
};

export default Logo;
