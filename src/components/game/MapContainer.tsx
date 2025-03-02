import React, { Component } from "react";
import Pet from "./Pet";
import "./styles/MapContainer.css";
import Dialogue from "./Dialogue";


interface PetData {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string;
  health: number;
  xVel: number;  // Velocity in x direction
  yVel: number;  // Velocity in y direction
  damage: number;
  isPushedBack: boolean; // Flag for push-back state
}

class MapContainer extends Component {
  pets: { [key: number]: PetData } = {};

  containerWidth: number = 800;
  containerHeight: number = 600;

  constructor(props: any) {
    super(props);
    this.pets = {
      1: {
        id: 1,
        x: 150,
        y: 250,
        width: 50,
        height: 50,
        imageUrl: "/images/pet.svg",
        health: 100,
        xVel: 4,
        yVel: 3,
        damage: 10,
        isPushedBack: false
      },
      2: {
        id: 2,
        x: 550,
        y: 250,
        width: 50,
        height: 50,
        imageUrl: "/images/pet.svg",
        health: 100,
        xVel: -5,
        yVel: -4,
        damage: 10,
        isPushedBack: false
      }
    };
  }

  random: number = 0;

  getRandomFactor() {
    if (this.random != 0)
      return this.random;
    this.random = Math.random() * 0.1 - 0.2;
    return this.random;
  }

  counter: number = 0;
  done: boolean = false;

  movePet(id1: number, id2: number) {
    if (this.done) {
      return;
    }
    const pet1 = this.pets[id1];
    const pet2 = this.pets[id2];
    if (!pet1 || !pet2) return;

    // Calculate the vector from pet1 to pet2
    const dx = pet2.x - pet1.x;
    const dy = pet2.y - pet1.y;

    // Calculate the distance between the pets
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction vector to get unit vector
    const normX = dx / distance;
    const normY = dy / distance;

    // Set the speed at which the pets will move
    const speed = 2; // You can adjust the speed here

    // Update the velocities
    pet1.xVel = normX * speed;
    pet1.yVel = normY * speed;

    pet2.xVel = -normX * speed; // Opposite direction for pet2
    pet2.yVel = -normY * speed;

    // Apply the push-back incrementally if needed
    const pushBackStep = 5; // Adjust the push-back step distance

    // Boundary check and movement for pet1 and pet2 inside the loop
     {
      // Move pet1 if not pushed back
      if (!pet1.isPushedBack) {
        pet1.x += pet1.xVel;
        pet1.y += pet1.yVel;
      } else {
        // Apply push-back if it's pushed back
        pet1.xVel += this.getRandomFactor();
        pet1.yVel += this.getRandomFactor();
        pet1.x -= pet1.xVel * pushBackStep;
        pet1.y -= pet1.yVel * pushBackStep;
      }

      // Boundary check for pet1
      if (pet1.x < 0) {
        pet1.x = 0;
        pet1.xVel = 0; // Stop movement when hitting left boundary
        pet1.isPushedBack = false; // Disable push-back
        this.random = this.counter = 0;
      }
      if (pet1.x + 4.5*pet1.width > this.containerWidth) {
        pet1.x = this.containerWidth - 4.5*pet1.width; // Adjust position to the left of the boundary
        pet1.xVel = 0; // Stop movement when hitting right boundary
        pet1.isPushedBack = false; // Disable push-back
        this.random = this.counter = 0;
      }
      if (pet1.y < 0) {
        pet1.y = 0;
        pet1.yVel = 0; // Stop movement when hitting top boundary
        pet1.isPushedBack = false; // Disable push-back
        this.random = this.counter = 0;
      }
      if (pet1.y + pet1.height > this.containerHeight) {
        pet1.y = this.containerHeight - pet1.height;
        pet1.yVel = 0; // Stop movement when hitting bottom boundary
        pet1.isPushedBack = false; // Disable push-back
        this.random = this.counter = 0;
      }
      if (this.counter++ >= 20) {
        pet1.isPushedBack = false; // Disable push-back
        this.random = this.counter = 0;
      }

      // Move pet2 if not pushed back
      if (!pet2.isPushedBack) {
        pet2.x += pet2.xVel;
        pet2.y += pet2.yVel;
      } else {
        // Apply push-back if it's pushed back
        pet2.xVel += this.getRandomFactor();
        pet2.yVel += this.getRandomFactor();
        pet2.x -= pet2.xVel * pushBackStep;
        pet2.y -= pet2.yVel * pushBackStep;
      }

      // Boundary check for pet2
      if (pet2.x < 0) {
        pet2.x = 0;
        pet2.xVel = 0; // Stop movement when hitting left boundary
        pet2.isPushedBack = false; // Disable push-back
      }
      if (pet2.x + 4.5*pet2.width > this.containerWidth) {
        pet2.x = this.containerWidth - 4.5*pet2.width; // Adjust position to the left of the boundary
        pet2.xVel = 0; // Stop movement when hitting right boundary
        pet2.isPushedBack = false; // Disable push-back
      }
      if (pet2.y < 0) {
        pet2.y = 0;
        pet2.yVel = 0; // Stop movement when hitting top boundary
        pet2.isPushedBack = false; // Disable push-back
      }
      if (pet2.y + pet2.height > this.containerHeight) {
        pet2.y = this.containerHeight - pet2.height;
        pet2.yVel = 0; // Stop movement when hitting bottom boundary
        pet2.isPushedBack = false; // Disable push-back
      }
      if (this.counter++ >= 20) {
        pet2.isPushedBack = false; // Disable push-back
        this.random = this.counter = 0;
      }
    }

    // Check if the pets are touching
    if (
      pet1.x < pet2.x + pet2.width &&
      pet1.x + pet1.width > pet2.x &&
      pet1.y < pet2.y + pet2.height &&
      pet1.y + pet1.height > pet2.y
    ) {
      // Both pets are touching, enable push-back for both
      pet1.isPushedBack = true;
      pet2.isPushedBack = true;
      pet1.health -= pet2.damage;
      pet2.health -= pet1.damage;

      // Push the pets apart by reversing their velocities
      
      pet1.xVel = -pet1.xVel;
      pet1.yVel = -pet1.yVel;

      pet2.xVel = -pet2.xVel;
      pet2.yVel = -pet2.yVel;

      // Move them slightly apart to avoid overlap
      pet1.x += pet1.xVel;
      pet1.y += pet1.yVel;
      pet2.x += pet2.xVel;
      pet2.y += pet2.yVel;
    }

    if (pet1.health <= 0 || pet2.health <= 0) {
      let winner = pet1.health <= 0 ? `Pet ${pet2.id} Wins!` : `Pet ${pet1.id} Wins!`;
    
      this.done = true;
    }

    // Update the pets' positions
    this.setState({});
  }

  componentDidMount() {
    // Set up movement logic (e.g., move every frame or after some interval)
    setInterval(() => {
      // Move both pets towards each other
      this.movePet(1, 2);
    }, 16); // ~60 FPS
  }

  render() {
    return (
      <div className="map-container">
        {this.done ? (<Dialogue text={"Game over."}/>) : (<></>)}
        {Object.values(this.pets).map((pet) => (
          <Pet
            key={pet.id}
            x={pet.x}
            y={pet.y}
            width={pet.width}
            height={pet.height}
            imageUrl={pet.imageUrl}
            health={pet.health}
          />
        ))}
      </div>
    );
  }
}

export default MapContainer;
