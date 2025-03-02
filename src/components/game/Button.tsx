"use client";

import React, { Component } from "react";
import "./styles/Button.css"

interface ButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

class Button extends Component<ButtonProps> {
  static defaultProps = {
    className: "default-btn",
  };

  render() {
    const { onClick, className, children } = this.props;
    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  }
}

export default Button;
