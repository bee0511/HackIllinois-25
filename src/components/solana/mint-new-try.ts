import { Connection, Keypair } from  "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, setAuthority, transfer } from  "@solana/spl-token";

const quicknodeEndpoint = 'https://little-neat-resonance.solana-devnet.quiknode.pro/499acb2ce0756adb88d0c549ff58c13b7f5f1d78/';
const connection = new Connection(quicknodeEndpoint, "confirmed");

const secret=[162,240,255,160,133,220,157,118,126,169,66,13,42,156,210,236,250,57,115,106,183,10,94,163,142,55,135,251,150,232,118,105,241,98,22,42,178,25,143,229,86,119,56,209,165,89,184,129,111,36,88,198,134,22,196,234,74,224,132,216,120,105,26,120];
const fromWallet = Keypair.fromSecretKey(new Uint8Array(secret));


export const mintGameNFT = async () => {
    console.log("Your Wallet Address:", fromWallet.publicKey.toBase58());
    const metadataURI = "https://ipfs.io/ipfs/YOUR_JSON_CID";
  // Create a new token 
  const mint = await createMint(
    connection, 
    fromWallet,            // Payer of the transaction
    fromWallet.publicKey,  // Account that will control the minting 
    null,                  // Account that will control the freezing of the token 
    0                      // Location of the decimal place 
  );

  // Get the token account of the fromWallet Solana address. If it does not exist, create it.
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    fromWallet.publicKey
  );

  // Generate a new wallet to receive the newly minted token
  const toWallet = Keypair.generate();

  // Get the token account of the toWallet Solana address. If it does not exist, create it.
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    toWallet.publicKey
  );

  // Minting 1 new token to the "fromTokenAccount" account we just returned/created.
  let signature = await mintTo(
    connection,
    fromWallet,               // Payer of the transaction fees 
    mint,                     // Mint for the account 
    fromTokenAccount.address, // Address of the account to mint to 
    fromWallet.publicKey,     // Minting authority
    1                         // Amount to mint 
  );

  await setAuthority(
    connection,
    fromWallet,            // Payer of the transaction fees
    mint,                  // Account 
    fromWallet.publicKey,  // Current authority 
    0,                     // Authority type: "0" represents Mint Tokens 
    null                   // Setting the new Authority to null
  );

  signature = await transfer(
    connection,
    fromWallet,               // Payer of the transaction fees 
    fromTokenAccount.address, // Source account 
    toTokenAccount.address,   // Destination account 
    fromWallet.publicKey,     // Owner of the source account 
    1                         // Number of tokens to transfer 
  );


  console.log("SIGNATURE", signature);
  // ✅ Step 8: Return the mint address
  try{
    console.log("✅ NFT Minted Successfully! Mint Address:", mint.toBase58());
    return mint.toBase58(); // ✅ Return the mint address correctly
} catch (error) {
  console.error("❌ NFT Minting Failed:", error);
  return null; // Return null in case of failure

};
}