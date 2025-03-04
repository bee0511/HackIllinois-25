'use client';

import { useState } from "react";
import AdventureCard from "@/components/shop/AdventureCard";
import ChatbotContainer from "@/components/shop/ChatbotContainer";
import WalletHeader from "@/components/shop/WalletHeader";
import { mintGameNFT } from "@/components/solana/mint-new-try";  // ✅ Import mint function
import styles from "@/components/shop/styles/Home.module.css";

interface Adventure {
  title: string;
  description: string;
  image: string;
  backgroundColor: string;
  textColor: string;
}

const adventures: Adventure[] = [
  { 
    title: "Lost in the Woods", 
    description: "Find your way back to safety.", 
    image: "./images/woods.jpg", 
    backgroundColor: "linear-gradient(135deg, #4b9e42, #88d498)",
    textColor: "#ffffff"  
  },
  { 
    title: "Desert Escape", 
    description: "Survive the harsh desert.", 
    image: "./images/desert.jpg", 
    backgroundColor: "linear-gradient(135deg, #f4a261, #e76f51)",
    textColor: "#333333"  
  },
  { 
    title: "Ocean Depths", 
    description: "Dive into the deep ocean.", 
    image: "./images/ocean.jpg", 
    backgroundColor: "linear-gradient(135deg, #2d6a4f, #1e3c72)",
    textColor: "#ffffff"  
  },
  { 
    title: "Mountain Expedition", 
    description: "Climb the highest peaks.", 
    image: "./images/mountain.jpg", 
    backgroundColor: "linear-gradient(135deg, #5c4d7d, #a3a1c9)",
    textColor: "#ffffff"  
  },
  { 
    title: "Space Odyssey", 
    description: "Journey through the stars.", 
    image: "./images/space.jpg", 
    backgroundColor: "linear-gradient(135deg, #1d2b64, #f8cdda)",
    textColor: "#ffffff"  
  },
  { 
    title: "Cave Exploration", 
    description: "Uncover secrets in the cave.", 
    image: "./images/cave.jpg", 
    backgroundColor: "linear-gradient(135deg, #333333, #dd1818)",
    textColor: "#ffffff"  
  },
  { 
    title: "Treasure Hunt", 
    description: "Search for the hidden treasure.", 
    image: "./images/treasure.jpg", 
    backgroundColor: "linear-gradient(135deg, #c31432, #240b36)",
    textColor: "#ffffff"  
  },
];

export default function Home() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedAdventure, setSelectedAdventure] = useState<string | null>(null);
  const [chatBackground, setChatBackground] = useState("");
  const [chatTextColor, setChatTextColor] = useState("");
  const [mintStatus, setMintStatus] = useState<string | JSX.Element | null>(null);
  const [minting, setMinting] = useState(false); // ✅ Track minting state
  const [mintAddress, setMintAddress] = useState<string | null>(null); // ✅ Track mint address

  const handleAdventureSelect = (adventure: Adventure) => {
    setSelectedAdventure(adventure.title);
    setChatBackground(adventure.backgroundColor);
    setChatTextColor(adventure.textColor);
    setShowChatbot(true);
    setMintStatus(null); // ✅ Reset minting status on new selection
    setMintAddress(null); // ✅ Reset mint address on new selection
  };

  const handleMintClick = async () => {
    console.log(`Minting NFT for: ${selectedAdventure}`);
    setMinting(true);

    try {
      const mintAddress = await mintGameNFT();
      if (mintAddress) {
        const explorerLink = `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`;
        console.log("✅ NFT Minted Successfully! View it here:", explorerLink);
        setMintAddress(mintAddress);
        setMintStatus(
          <a href={explorerLink} target="_blank" rel="noopener noreferrer">
            ✅ Click to View NFT on Solana!
          </a>
        );
      } else {
        throw new Error("Mint Address is null");
      }
    } catch (error) {
      console.error("❌ NFT Minting Failed:", error);
      setMintStatus("❌ NFT Minting Failed. Check console for details.");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className={styles.container}>
      {!showChatbot && <WalletHeader balance={50.75} />} 

      {!showChatbot ? (
        <>
          <h1 className={styles.title}>Choose Your Next Adventure</h1>
          <div className={styles.cardGrid}>
            {adventures.map((adventure, index) => (
              <AdventureCard
                key={index}
                title={adventure.title}
                description={adventure.description}
                image={adventure.image}
                onSelect={() => handleAdventureSelect(adventure)}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <ChatbotContainer 
            adventureName={selectedAdventure || ""} 
            backgroundColor={chatBackground} 
            textColor={chatTextColor} 
          />

          {/* ✅ Mint Button Appears Inside Chatbot UI */}
          <button 
            onClick={handleMintClick} 
            disabled={minting} 
            className={styles.mintButton}
          >
            {minting ? "Minting..." : mintAddress ? "View NFT" : "Mint NFT"}
          </button>

          {/* ✅ Display Minting Status */}
          {mintStatus && (
            <div className={styles.mintStatus}>
              <p>{mintStatus}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}