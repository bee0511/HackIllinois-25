import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, Idl } from "@coral-xyz/anchor";
import idl from "../../../anchor/target/idl/HackIllinois25.json"; 

export async function updateGameNFT(nftAddress: PublicKey, newActions: string[], newResults: string[], newHP: number, newATK: number, newDEF: number) {
    const wallet = useWallet();
    const { publicKey, signTransaction, signAllTransactions } = wallet;
    const { connection } = useConnection();

    if (!wallet.publicKey) {
        throw new Error("Wallet is not connected");
    }
    if (!publicKey || !signTransaction || !signAllTransactions) {
        throw new Error("Wallet is not fully connected");
    }
    
    const anchorWallet = {
        publicKey,
        signTransaction,
        signAllTransactions,
    };
    

    const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
    const program = new Program(idl as Idl, provider);

    // ✅ Convert arrays to JSON strings for storage
    const actionsString = JSON.stringify(newActions);
    const resultsString = JSON.stringify(newResults);

    // ✅ Call update function on Solana program
    const tx = await program.methods
        .updateNft(actionsString, resultsString, newHP, newATK, newDEF)
        .accounts({
            metadata: nftAddress, // ✅ NFT metadata account
            owner: wallet.publicKey, // ✅ Only owner can update
        })
        .rpc();

    console.log("NFT Updated Successfully:", tx);
    alert("NFT Updated Successfully!");

    return tx;
}