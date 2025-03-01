#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod HackIllinois25 {
    use super::*;

  pub fn close(_ctx: Context<CloseHackIllinois25>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.HackIllinois25.count = ctx.accounts.HackIllinois25.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.HackIllinois25.count = ctx.accounts.HackIllinois25.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeHackIllinois25>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.HackIllinois25.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeHackIllinois25<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + HackIllinois25::INIT_SPACE,
  payer = payer
  )]
  pub HackIllinois25: Account<'info, HackIllinois25>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseHackIllinois25<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub HackIllinois25: Account<'info, HackIllinois25>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub HackIllinois25: Account<'info, HackIllinois25>,
}

#[account]
#[derive(InitSpace)]
pub struct HackIllinois25 {
  count: u8,
}
