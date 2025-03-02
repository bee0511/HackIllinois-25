// import { Metaplex, bundlrStorage, identity, toMetaplexFile } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useHackIllinois25Program } from '../HackIllinois25/HackIllinois25-data-access';
import { useState } from 'react';
import { AnchorProvider, Program, web3, Idl } from '@coral-xyz/anchor';
import idl from '../../../anchor/target/idl/HackIllinois25.json'; 
import fs from "fs";


// async function uploadGameHistory(scenario: string, actions: string, results: string) {
//     const gameData = {
//         scenario,
//         actions,
//         results,
//     };

//     const wallet = useWallet();
//     const { connection } = useConnection();
//     if (!wallet.publicKey) {
//         throw new Error('Wallet is not connected');
//     }
//     const metaplex = Metaplex.make(connection)
//         .use(walletAdapterIdentity(wallet)) // ✅ Old API for identity
//         .use(metaplexStorage()); 

//     const jsonBuffer = Buffer.from(JSON.stringify(gameData));
//     const uri = await metaplex.storage().upload(jsonBuffer);
//     console.log("Game history uploaded to IPFS:", uri);

//     return uri;
// }


'use client';
export default function MintNFT(selectedScenario: string) {
  const wallet = useWallet();
  const { publicKey, signTransaction, signAllTransactions } = wallet;
  const { connection } = useConnection();
  const { programId } = useHackIllinois25Program();
  const [minting, setMinting] = useState(false);

  const mintGameNFT = async () => {
    if (!selectedScenario) {
        alert("No scenario selected!");
        return;
      }

    if (!publicKey || !signTransaction || !signAllTransactions) { 
      alert('Please connect your wallet first!');
      return;
    }

    setMinting(true);

    try {
      // ✅ Generate Game Data
      // const gameData = {
      //   scenario: selectedScenario,
      //   actions: "",
      //   results: "",
      // };

      // const ipfsUri = await uploadGameHistory(gameData.scenario, gameData.actions, gameData.results);

      // ✅ Connect to Solana Program
      const anchorWallet = { publicKey, signTransaction, signAllTransactions };
      const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
      const program = new Program(idl as Idl, provider);
      const scenario = selectedScenario;
      const actions = JSON.stringify([]);  // ✅ Store as an empty array (initially)
      const results = JSON.stringify([]);  // ✅ Store as an empty array (initially)

      // ✅ Generate NFT Mint Address
      const nftAccount = web3.Keypair.generate();

      // ✅ Call Smart Contract
      const tx = await program.methods
        .mintNft(selectedScenario, publicKey, 10, 10, 10, scenario, actions, results) // NFT Metadata
        .accounts({
          mint: nftAccount.publicKey,
          owner: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([nftAccount])
        .rpc();

      console.log('NFT Minted:', tx);
      alert('NFT Minted Successfully!');

    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT.');
    }

    setMinting(false);
  };
}


export { MintNFT };