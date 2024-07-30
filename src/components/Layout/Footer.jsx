import React from "react";

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="footer text-center py-1">
            © {year} Developed by <span className="text-primary">Arup Panda</span>.  All rights reserved.
        </footer>
    );
};

export default Footer;
