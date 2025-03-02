"use client";

import React, { Component } from "react";
import "./styles/LinkButton.css";

interface LinkButtonProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

class LinkButton extends Component<LinkButtonProps> {
  static defaultProps = {
    className: "default-link-btn",
  };

  render() {
    const { to, className, children } = this.props;
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }
}

export default LinkButton;
