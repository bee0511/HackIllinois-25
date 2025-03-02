import React, { Component } from "react";
import "./styles/Dialogue.css";

interface DialogueProps {
  text?: string; // Optional prop with default value
  onClose?: () => void; // Optional function
}

interface DialogueState {
  isVisible: boolean;
}

class Dialogue extends Component<DialogueProps, DialogueState> {
  static defaultProps: DialogueProps = {
    text: "Default dialogue message.", // Default text
  };

  constructor(props: DialogueProps) {
    super(props);
    this.state = {
      isVisible: true,
    };
  }

  handleClose = () => {
    this.setState({ isVisible: false });
    if (this.props.onClose) {
      this.props.onClose(); // Only call if provided
    }
  };

  render() {
    if (!this.state.isVisible) return null;

    return (
      <div className="dialogue-container">
        <div className="dialogue-box">
          <p>{this.props.text}</p>
          <button onClick={this.handleClose}>Close</button>
        </div>
      </div>
    );
  }
}

export default Dialogue;
