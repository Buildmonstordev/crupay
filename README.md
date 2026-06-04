<div align="center">
  <h1>💸 crupay</h1>
  <p><b>The Instant Crypto-to-UPI Bridge for India</b></p>
  <p>Pay any UPI ID in India directly from your Solana wallet via our trustless P2P marketplace.</p>
</div>

---

## What is crupay?

crupay is a decentralized peer-to-peer (P2P) payment infrastructure that seamlessly bridges **Solana** with India's **UPI** network. It allows users to off-ramp their crypto (SOL/USDC) instantly into everyday fiat payments without centralized exchanges, high fees, or waiting days for bank settlements.

Whether you are a freelancer wanting to spend your crypto earnings at a local grocery store, or a business generating invoices, crupay handles the crypto-to-fiat conversion invisibly through a P2P matching engine.

## How It Works

crupay operates a **P2P Escrow Marketplace** under the hood. To the end user, it feels exactly like a standard payment app:

1. **User Scans/Enters UPI:** A user scans a merchant's UPI QR code or enters a UPI ID and an INR amount.
2. **Crypto Deposit:** The system calculates the SOL/USDC equivalent. The user signs a transaction, locking the crypto in an on-chain escrow.
3. **P2P Matching:** A liquidity provider (someone with INR who wants crypto) fulfills the order by paying the merchant's UPI ID.
4. **Escrow Release:** Once the UPI payment is verified, the escrow releases the crypto to the liquidity provider.

*To the user making the payment, the entire P2P matching process is abstracted away.*

## Key Features

### 📱 Lite App (Scan & Pay)
A mobile-optimized, web-based QR scanner. Simply point your camera at any standard Google Pay, PhonePe, or Paytm QR code, connect your Solana wallet (Phantom/Solflare), and pay the merchant directly in crypto.

### 🧾 Web3 Invoicing
Built for freelancers and businesses. Generate professional invoices, share Solana Pay links, and track payment status in real-time.

### 🛡️ P2P Escrow Architecture
Trustless and secure. Crypto never goes directly to crupay; it is locked in an escrow address and only released when the exact INR amount hits the destination UPI address.

### 💱 Multi-Token Support
Pay with **SOL** or **USDC**. CruPay dynamically calculates exchange rates to ensure merchants receive the exact INR amount requested.

## Tech Stack

* **Frontend:** Next.js 16 (App Router), React 19, TypeScript
* **Styling:** Tailwind CSS v4, shadcn/ui, Motion (Framer Motion)
* **Wallet Integration:** ConnectorKit (`@solana/connector`)
* **Solana Payments:** `@solana/pay` v1.0, `@solana/kit`
* **Design System:** "Neo-Deccan" (Glassmorphism, deep indigo base, saffron accents)
* **QR Scanning:** `html5-qrcode`

## Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Buildmonstordev/crupay.git
   cd crupay/dashboard
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Start the development server:**
   ```bash
   bun run dev
   ```

4. **Explore the App:**
   - **Dashboard:** `http://localhost:3000/dashboard`
   - **Lite App (Mobile View):** `http://localhost:3000/lite`
   - **Ops/Admin Panel:** `http://localhost:3000/admin`

---

<div align="center">
  <i>Built for the Solana ecosystem.</i>
</div>
