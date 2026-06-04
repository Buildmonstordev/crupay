"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@solana/connector/react";
import { useSolanaTx } from "@/lib/solana-tx";
import { generatePaymentQR, qrToDataURL } from "@/lib/solana-pay";
import { Wallet, Loader2, CheckCircle, QrCode } from "lucide-react";
import { toast } from "sonner";

interface SolanaPayPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  recipient?: string;
  label?: string;
  description?: string;
}

const DEFAULT_RECIPIENT = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";

export function SolanaPayPopup({
  open,
  onOpenChange,
  amount,
  recipient = DEFAULT_RECIPIENT,
  label = "CruPay Invoice",
  description,
}: SolanaPayPopupProps) {
  const { isConnected } = useWallet();
  const { sendSol, ready } = useSolanaTx();
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open && amount > 0) {
      generateQR();
    }
    if (!open) {
      setDone(false);
      setQrUrl(null);
    }
  }, [open, amount]);

  async function generateQR() {
    try {
      const qr = generatePaymentQR(recipient, amount, 256, undefined, label, description);
      const url = await qrToDataURL(qr);
      setQrUrl(url);
    } catch {
      // Handle error gracefully
    }
  }

  async function handlePay() {
    if (!ready) {
      toast.error("Wallet not ready");
      return;
    }
    setSending(true);
    try {
      const tx = await sendSol(recipient, amount);
      if (tx) {
        setDone(true);
        toast.success("Payment sent!");
      }
    } catch {
      toast.error("Payment failed");
    }
    setSending(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-card p-0 max-w-sm rounded-3xl overflow-hidden border-border shadow-2xl">
        <DialogHeader className="border-b border-border bg-card px-6 py-5">
          <DialogTitle className="text-center font-display text-lg font-bold text-foreground">
            {done ? "Payment Complete" : "Pay Invoice"}
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 bg-surface-1"
          >
            <div className="mx-auto w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center shadow-sm mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{amount} SOL</p>
            <p className="text-sm font-medium text-muted-foreground mt-2">{description || label}</p>
            <Button onClick={() => onOpenChange(false)} className="w-full h-12 mt-8 rounded-xl font-semibold btn-primary">
              Done
            </Button>
          </motion.div>
        ) : (
          <div className="p-6 bg-surface-1 space-y-6">
            <div className="text-center bg-card border border-border rounded-2xl py-6 shadow-sm">
              <p className="font-display text-4xl font-bold text-foreground">{amount} SOL</p>
              {description && <p className="text-sm font-medium text-muted-foreground mt-2 px-4 truncate">{description}</p>}
            </div>

            {/* QR Code */}
            <div className="flex justify-center my-4">
              {qrUrl ? (
                <div className="p-3 bg-card rounded-2xl shadow-sm border border-border">
                  <img src={qrUrl} alt="Payment QR" width={200} height={200} className="rounded-xl" />
                </div>
              ) : (
                 <div className="w-[200px] h-[200px] bg-card border border-border rounded-2xl flex items-center justify-center shadow-sm">
                  <QrCode className="h-10 w-10 text-muted-foreground animate-pulse" />
                </div>
              )}
            </div>

            <p className="text-center font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              SCAN WITH ANY SOLANA WALLET
            </p>

            <div className="flex justify-center pb-2">
              <span className="font-mono text-[10px] font-bold px-2 py-1 bg-card border border-border rounded-md uppercase tracking-widest shadow-sm">OR</span>
            </div>

            {/* Pay button */}
            <Button
              onClick={handlePay}
              disabled={sending || !isConnected || !ready}
              className="w-full h-14 rounded-xl font-bold text-base btn-primary transition-shadow shadow-sm"
            >
              {sending ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</>
              ) : !isConnected ? (
                <><Wallet className="mr-2 h-5 w-5" />Connect to Pay</>
              ) : (
                <><Wallet className="mr-2 h-5 w-5" />Pay {amount} SOL</>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}