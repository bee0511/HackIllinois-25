#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("Csf3YvCd81JfpXs42Zko153e99tCp8B2KYmRfYYbaMiP"); // Your program ID

#[program]
pub mod HackIllinois25 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Initializing NFT Pet Account");
        Ok(())
    }

    pub fn mint_pet(ctx: Context<MintPet>, name: String, species: String) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        pet.owner = *ctx.accounts.owner.key;
        pet.name = name.clone();
        pet.species = species.clone();
        pet.experience = 0;
        pet.hunger = 100;
        msg!("Minted pet {} of species {}", name, species);
        Ok(())
    }

    pub fn update_pet(ctx: Context<UpdatePet>, experience: u64, hunger: u64) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        pet.experience = experience;
        pet.hunger = hunger;
        msg!("Updated pet: Experience = {}, Hunger = {}", experience, hunger);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct MintPet<'info> {
    #[account(init, payer = owner, space = 128)]
    pub pet: Account<'info, Pet>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePet<'info> {
    #[account(mut, has_one = owner)]
    pub pet: Account<'info, Pet>,
    pub owner: Signer<'info>,
}

#[account]
pub struct Pet {
    pub owner: Pubkey,
    pub name: String,
    pub species: String,
    pub experience: u64,
    pub hunger: u64,
}
