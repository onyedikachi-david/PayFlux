#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod pay_flux {
    use super::*;

    pub fn create_payment(
        ctx: Context<CreatePayment>,
        request_id: String,
        amount: u64,
        recipient_details: RecipientDetails,
    ) -> Result<()> {
        let payment_request = &mut ctx.accounts.payment_request;
        payment_request.sender = ctx.accounts.sender.key();
        payment_request.amount = amount;
        payment_request.status = PaymentStatus::Pending;
        payment_request.market_maker = None;
        payment_request.recipient_details = recipient_details.clone();
        payment_request.bump = ctx.bumps.payment_request;
        payment_request.request_id = request_id.clone();

        // Emit payment created event
        emit!(PaymentCreatedEvent {
            request_id,
            sender: ctx.accounts.sender.key(),
            amount,
            recipient_details
        });
        Ok(())
    }

    pub fn fulfill_payment(ctx: Context<FulfillPayment>) -> Result<()> {
        let payment_request = &mut ctx.accounts.payment_request;
        require!(
            payment_request.status == PaymentStatus::Pending,
            PayFluxError::InvalidPaymentStatus
        );

        payment_request.market_maker = Some(ctx.accounts.market_maker.key());
        payment_request.status = PaymentStatus::Completed;

        // Emit payment fulfilled event
        emit!(PaymentFulfilledEvent {
            request_id: payment_request.request_id.clone(),
            market_maker: ctx.accounts.market_maker.key(),
            amount: payment_request.amount,
        });
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(request_id: String)]
pub struct CreatePayment<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        init,
        payer = sender,
        space = 8 + // discriminator
               32 + // sender pubkey
               8 + // amount
               1 + // status enum
               33 + // market_maker Option<Pubkey>
               RecipientDetails::SIZE +
               1 + // bump
               50, // request_id string (max length 50)
        seeds = [b"payment", request_id.as_bytes()],
        bump
    )]
    pub payment_request: Account<'info, PaymentRequest>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FulfillPayment<'info> {
    #[account(mut)]
    pub market_maker: Signer<'info>,

    #[account(mut)]
    pub payment_request: Account<'info, PaymentRequest>,
}

#[account]
#[derive(InitSpace)]
pub struct PaymentRequest {
    pub sender: Pubkey,
    pub amount: u64,
    pub status: PaymentStatus,
    pub market_maker: Option<Pubkey>,
    pub recipient_details: RecipientDetails,
    pub bump: u8,
    #[max_len(50)]
    pub request_id: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, InitSpace)]
pub enum PaymentStatus {
    Pending,
    Completed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct RecipientDetails {
    #[max_len(10)]
    pub account_number: String,
    #[max_len(100)]
    pub account_name: String,
    #[max_len(15)]
    pub phone_number: String,
}

impl RecipientDetails {
    // Calculate the size needed for RecipientDetails
    pub const SIZE: usize = 10 + // account_number max length
                           100 + // account_name max length
                           15; // phone_number max length
}

#[error_code]
pub enum PayFluxError {
    #[msg("Invalid payment status for this operation")]
    InvalidPaymentStatus,
}

// Event emitted when a new payment request is created
#[event]
pub struct PaymentCreatedEvent {
    pub request_id: String,
    pub sender: Pubkey,
    pub amount: u64,
    pub recipient_details: RecipientDetails,
}

// Event emitted when a payment is fulfilled by a market maker
#[event]
pub struct PaymentFulfilledEvent {
    pub request_id: String,
    pub market_maker: Pubkey,
    pub amount: u64,
}
