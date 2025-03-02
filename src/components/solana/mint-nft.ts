'use client';

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { AnchorProvider, Program, web3, Idl } from "@coral-xyz/anchor";
import idl from "../../../anchor/target/idl/hack_illinois_25.json";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from "@solana/spl-token";

export function useMintGameNFT(selectedScenario: string) {
  const wallet = useWallet();
  const { publicKey, signTransaction, signAllTransactions } = wallet;
  const { connection } = useConnection();
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
      console.log("🚀 Minting started...");

      // ✅ Generate NFT Mint Address
      const nftMint = web3.Keypair.generate();
      console.log("🎨 New NFT Mint Address:", nftMint.publicKey.toBase58());

      // ✅ Get Associated Token Account (ATA)
      const tokenAccount = await getAssociatedTokenAddress(
        nftMint.publicKey, 
        publicKey, 
        false, 
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      console.log("📜 Token Account (ATA):", tokenAccount.toBase58());

      // ✅ Connect to Solana Program
      const anchorWallet = { publicKey, signTransaction, signAllTransactions };
      const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
      const program = new Program(idl as Idl, provider);

      // ✅ Ensure ATA exists by creating it if necessary
      const ataTx = new web3.Transaction().add(
        createAssociatedTokenAccountInstruction(
          publicKey, 
          tokenAccount, 
          publicKey, 
          nftMint.publicKey, 
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );

      await provider.sendAndConfirm(ataTx);
      console.log("✅ Associated Token Account Created:", tokenAccount.toBase58());

      // ✅ Call Smart Contract
      const tx = await program.methods
        .mintNft(selectedScenario, 10, 10, 10, "https://hi") // NFT Metadata
        .accounts({
          mint: nftMint.publicKey,
          owner: publicKey,
          tokenAccount, // ✅ Now provided
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([nftMint])
        .rpc();

      console.log("✅ NFT Minted! Transaction ID:", tx);
      console.log("✅ NFT Mint Address:", nftMint.publicKey.toBase58());

      alert(`NFT Minted! Check Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    } catch (error) {
      console.error("❌ Error minting NFT:", error);
      alert("Failed to mint NFT. Check console for details.");
    }

    setMinting(false);
  };

  return { mintGameNFT, minting };
}
