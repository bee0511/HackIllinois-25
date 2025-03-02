"use client"

import React from 'react';
import HealthBar from './HealthBar';

interface PetProps {
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string;
  health: number; // Add health as a property
}

const Pet: React.FC<PetProps> = ({ x, y, width, height, imageUrl, health }) => {
  return (
    <>
      <HealthBar
          x={x}
          y={y}
          width={100} // Set the width of the health bar
          height={5}  // Set the height of the health bar
          health={health} // Pass the health prop to HealthBar
      />
      <div
        className="pet"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`,
          position: 'absolute',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
        }}
      />
    </>
  );
};

export default Pet;
