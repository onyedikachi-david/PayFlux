#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod PayFlux {
    use super::*;

  pub fn close(_ctx: Context<ClosePayFlux>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.PayFlux.count = ctx.accounts.PayFlux.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.PayFlux.count = ctx.accounts.PayFlux.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializePayFlux>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.PayFlux.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializePayFlux<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + PayFlux::INIT_SPACE,
  payer = payer
  )]
  pub PayFlux: Account<'info, PayFlux>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct ClosePayFlux<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub PayFlux: Account<'info, PayFlux>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub PayFlux: Account<'info, PayFlux>,
}

#[account]
#[derive(InitSpace)]
pub struct PayFlux {
  count: u8,
}
