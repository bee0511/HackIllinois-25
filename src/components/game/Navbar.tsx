"use client";

import React, { Component } from "react";
import LinkButton from "./LinkButton";
import "./styles/Navbar.css";

interface NavbarProps {
  className?: string;
}

class Navbar extends Component<NavbarProps> {
  static defaultProps = {
    className: "default-navbar",
  };

  render() {
    const { className } = this.props;

    const links = [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Game", to: "/game"}
    ];

    return (
      <nav className={className}>
        {links.map((link, index) => (
          <LinkButton key={index} to={link.to} className="default-navbar-link-btn">
            {link.label}
          </LinkButton>
        ))}
      </nav>
    );
  }
}

export default Navbar;