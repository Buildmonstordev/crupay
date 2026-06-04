"use client";

import { useCallback } from "react";
import { useKitTransactionSigner } from "@solana/connector/react";
import { createSolanaRpc, address, lamports } from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import {
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  signTransactionMessageWithSigners,
  getSignatureFromTransaction,
  getBase64EncodedWireTransaction,
} from "@solana/kit";
import { toast } from "sonner";

const DEVNET_RPC = "https://api.devnet.solana.com";

export function useSolanaTx() {
  const { signer, ready } = useKitTransactionSigner();

  const sendSol = useCallback(
    async (recipientAddress: string, amountSol: number) => {
      if (!signer || !ready) {
        toast.error("Wallet not ready");
        return null;
      }

      const rpc = createSolanaRpc(DEVNET_RPC);
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      const transferInstruction = getTransferSolInstruction({
        source: signer,
        destination: address(recipientAddress),
        amount: lamports(BigInt(Math.floor(amountSol * 1e9))),
      });

      const message = pipe(
        createTransactionMessage({ version: 0 }),
        (msg) => setTransactionMessageFeePayerSigner(signer, msg),
        (msg) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, msg),
        (msg) => appendTransactionMessageInstructions([transferInstruction], msg)
      );

      const signed = await signTransactionMessageWithSigners(message);
      const signature = getSignatureFromTransaction(signed);
      const wire = getBase64EncodedWireTransaction(signed);

      await rpc.sendTransaction(wire).send();
      toast.success(`Transaction sent: ${signature.slice(0, 16)}...`);
      return signature;
    },
    [signer, ready]
  );

  return { sendSol, ready };
}
