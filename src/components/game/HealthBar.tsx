import React from "react";

interface HealthBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ x, y, width, height, health }) => {
  const healthPercentage = Math.max(0, Math.min(100, health)); // Ensure health is between 0 and 100
  const healthWidth = (healthPercentage / 100) * width; // Calculate width of the health bar

  return (
    <div
      style={{
        position: "absolute",
        left: `${x - width / 4}px`, // Center the health bar
        top: `${y - height - 5}px`, // Position the health bar above the pet
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "gray", // Background color of the health bar container
        borderRadius: "5px",
      }}
    >
      <div
        style={{
          width: `${healthWidth}px`,
          height: "100%",
          backgroundColor: "green", // The green part representing the current health
          borderRadius: "5px",
        }}
      />
    </div>
  );
};

export default HealthBar;
