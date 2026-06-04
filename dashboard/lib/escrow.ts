import { Keypair, Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Generate a deterministic escrow keypair for devnet demo
// In production, this would be stored securely (KMS, HSM, env var)
const ESCROW_SEED = new Uint8Array([
  112, 97, 121, 109, 101, 110, 116, 115, 101, 116, 117, 95, 101, 115, 99, 114, 111, 119,
  95, 100, 101, 118, 110, 101, 116, 95, 107, 101, 121, 112, 97, 105, 114
]);

export const escrowKeypair = Keypair.fromSeed(ESCROW_SEED.slice(0, 32));
export const ESCROW_ADDRESS = escrowKeypair.publicKey.toString();

export const DEVNET_RPC = "https://api.devnet.solana.com";
export const connection = new Connection(DEVNET_RPC, "confirmed");

export async function getEscrowBalance(): Promise<number> {
  const balance = await connection.getBalance(escrowKeypair.publicKey);
  return balance / LAMPORTS_PER_SOL;
}

export async function releaseEscrowSol(recipientAddress: string, amountSol: number) {
  const recipient = new PublicKey(recipientAddress);
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: escrowKeypair.publicKey,
      toPubkey: recipient,
      lamports: amountSol * LAMPORTS_PER_SOL,
    })
  );
  const signature = await connection.sendTransaction(tx, [escrowKeypair]);
  await connection.confirmTransaction(signature, "confirmed");
  return signature;
}

export async function airdropEscrowIfNeeded() {
  const balance = await connection.getBalance(escrowKeypair.publicKey);
  if (balance < 0.5 * LAMPORTS_PER_SOL) {
    try {
      await connection.requestAirdrop(escrowKeypair.publicKey, 2 * LAMPORTS_PER_SOL);
    } catch {
      // Airdrop may fail if rate limited
    }
  }
}
