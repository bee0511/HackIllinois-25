// 'use client'

// import { useWallet } from '@solana/wallet-adapter-react'
// import { WalletButton } from '../solana/solana-provider'
// import { AppHero, ellipsify } from '../ui/ui-layout'
// import { ExplorerLink } from '../cluster/cluster-ui'
// import { useHackIllinois25Program } from './HackIllinois25-data-access'
// import { HackIllinois25Create, HackIllinois25List } from './HackIllinois25-ui'

// export default function HackIllinois25Feature() {
//   const { publicKey } = useWallet()
//   const { programId } = useHackIllinois25Program()

//   return publicKey ? (
//     <div>
//       <AppHero
//         title="HackIllinois25"
//         subtitle={
//           'Create a new account by clicking the "Create" button. The state of a account is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement, set, and close).'
//         }
//       >
//         <p className="mb-6">
//           <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
//         </p>
//         <HackIllinois25Create />
//       </AppHero>
//       <HackIllinois25List />
//     </div>
//   ) : (
//     <div className="max-w-4xl mx-auto">
//       <div className="hero py-[64px]">
//         <div className="hero-content text-center">
//           <WalletButton />
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useHackIllinois25Program } from './HackIllinois25-data-access';
import { useConnection } from '@solana/wallet-adapter-react';
import { useState } from 'react';
// import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import idl from '../../../anchor/target/idl/HackIllinois25.json'; // ✅ Ensure this IDL matches your deployed program
import {HackIllinois25} from '../../../anchor/target/types/HackIllinois25'; 
import { AnchorProvider, Idl, Program, web3 } from '@coral-xyz/anchor';
export default function HackIllinois25Feature() {
  const wallet = useWallet(); // Fix: Use wallet directly
  const { publicKey,signTransaction, signAllTransactions} = wallet;
  const { connection } = useConnection();
  const { programId } = useHackIllinois25Program();
  const [minting, setMinting] = useState(false);
  // ✅ Explicitly cast to `Idl` to ensure correct typing
  const mintPet = async () => {
    if (!publicKey || !signTransaction || !signAllTransactions) { 
      alert('Please connect your wallet first!');
      return;
    }

    setMinting(true);

    try {
      // const programId = new web3.PublicKey("Csf3YvCd81JfpXs42Zko153e99tCp8B2KYmRfYYbaMiP");

      // ✅ FIX: Wrap the wallet in an object to match Anchor's expected structure

      const anchorWallet = {
        publicKey,
        signTransaction,
        signAllTransactions,
      };
      const provider = new AnchorProvider(connection, anchorWallet , AnchorProvider.defaultOptions());
      const program = new Program(idl as Idl, provider);

      // Generate a new pet account
      const petAccount = web3.Keypair.generate();

      const tx = await program.methods
        .mintPet('Fluffy', 'Dragon') // You can replace this with dynamic input later
        .accounts({
          pet: petAccount.publicKey, // This is the NFT pet account
          owner: publicKey, // The wallet owner
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([petAccount]) // The new account must sign
        .rpc();

      console.log('NFT Pet Minted:', tx);
      alert('NFT Pet Minted Successfully!');
    } catch (error) {
      console.error('Error minting pet:', error);
      alert('Failed to mint NFT Pet.');
    }

    setMinting(false);
  };

  return publicKey ? (
    <div>
      <AppHero
        title="NFT Pet Project"
        subtitle="Mint your own NFT Pet and interact with it on Solana!"
      >
        <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <button onClick={mintPet} disabled={minting} className="btn btn-primary">
          {minting ? 'Minting...' : 'Mint NFT Pet'}
        </button>
      </AppHero>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
