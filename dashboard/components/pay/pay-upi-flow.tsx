"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@solana/connector/react";
import { useSolanaTx } from "@/lib/solana-tx";
import { ESCROW_ADDRESS } from "@/lib/escrow";
import { parseUpiQR } from "@/lib/upi-qr";
import { SolAmountInput } from "@/components/pay/sol-amount-input";
import {
  ArrowRight,
  ArrowLeft,
  Keyboard,
  Loader2,
  CheckCircle,
  FileText,
  Camera,
  Shield,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const SOL_PRICE = 150;

interface PayUPIFlowProps {
  onComplete?: (order: { id: string; inrAmount: number; solAmount: number; upiId: string }) => void;
}

export function PayUPIFlow({ onComplete }: PayUPIFlowProps) {
  const { isConnected, account } = useWallet();
  const { sendSol, ready } = useSolanaTx();

  const [step, setStep] = useState(1);
  const [solAmount, setSolAmount] = useState("");
  const [upiMethod, setUpiMethod] = useState<"id" | "qr" | null>(null);
  const [upiId, setUpiId] = useState("");
  const [sending, setSending] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const scannerRef = useRef<any>(null);
  const scanContainerRef = useRef<HTMLDivElement>(null);

  const inrAmount = solAmount ? parseFloat(solAmount) * SOL_PRICE : 0;

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch {}
        scannerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!scanning || !scanContainerRef.current) return;
    let cancelled = false;

    const initScanner = async () => {
      await new Promise((r) => setTimeout(r, 300));
      if (cancelled) return;

      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const el = document.getElementById("upi-qr-reader");
        if (!el || cancelled) return;

        const scanner = new Html5Qrcode("upi-qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (text: string) => {
            const parsed = parseUpiQR(text);
            if (parsed) {
              setUpiId(parsed.upiId);
              toast.success("UPI scanned: " + parsed.upiId + (parsed.name ? ` (${parsed.name})` : ""));
            } else {
              setUpiId(text);
              toast.success("QR scanned");
            }
            scanner.stop().catch(() => {});
            scannerRef.current = null;
            setScanning(false);
          },
          () => {}
        );
      } catch (err: any) {
        if (cancelled) return;
        const msg = String(err?.message || err);
        if (msg.includes("NotAllowed") || msg.includes("Permission")) {
          setCameraError("Camera blocked. Go to site settings and allow camera access.");
        } else if (msg.includes("NotFound") || msg.includes("device")) {
          setCameraError("No camera found on this device.");
        } else {
          setCameraError("Could not start camera. Try entering UPI ID manually.");
        }
        setScanning(false);
        setUpiMethod("id");
      }
    };

    initScanner();
    return () => {
      cancelled = true;
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch {}
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  const startScan = () => {
    setCameraError("");
    setScanning(true);
  };

  const stopScan = () => {
    if (scannerRef.current) {
      try { scannerRef.current.stop(); } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleConfirm = async () => {
    if (!isConnected || !ready) {
      toast.error("Connect your wallet first");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorAddress: account,
          upiId,
          inrAmount,
          cryptoAmount: parseFloat(solAmount),
          token: "SOL",
          description: `Pay ₹${Math.round(inrAmount)} to ${upiId}`,
        }),
      });
      const data = await res.json();

      const tx = await sendSol(ESCROW_ADDRESS, parseFloat(solAmount));
      if (tx) {
        await fetch(`/api/orders/${data.order.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "escrow", escrowTx: tx }),
        });
        setOrderId(data.order.id);
        setStep(4);
        toast.success("Payment submitted!");
        onComplete?.({ id: data.order.id, inrAmount, solAmount: parseFloat(solAmount), upiId });
      }
    } catch {
      toast.error("Transaction failed");
    }
    setSending(false);
  };

  const reset = () => {
    setStep(1);
    setSolAmount("");
    setUpiMethod(null);
    setUpiId("");
    setOrderId("");
    setSending(false);
    setScanning(false);
    setCameraError("");
  };

  const canProceed = () => {
    if (step === 1) return solAmount && parseFloat(solAmount) > 0;
    if (step === 2) return upiId.length > 2;
    if (step === 3) return isConnected;
    return false;
  };

  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-10">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= s ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: SOL Amount */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
            <SolAmountInput value={solAmount} onChange={setSolAmount} solPrice={SOL_PRICE} />
            <Button onClick={() => setStep(2)} disabled={!canProceed()} className="w-full h-14 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {/* Step 2: UPI Method */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="font-display text-2xl font-bold text-foreground">Destination</h3>
              <p className="text-sm text-primary font-mono font-semibold mt-1">
                Sending ₹{Math.round(inrAmount).toLocaleString("en-IN")}
              </p>
            </div>

            {!upiMethod && !scanning && (
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setUpiMethod("id")} className="flex flex-col items-center gap-4 border border-border bg-card p-6 rounded-2xl hover:border-primary/30 transition-all shadow-sm group">
                  <div className="h-14 w-14 bg-muted rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Keyboard className="h-6 w-6 text-foreground group-hover:text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">Enter UPI ID</span>
                </button>
                <button onClick={startScan} className="flex flex-col items-center gap-4 border border-border bg-card p-6 rounded-2xl hover:border-primary/30 transition-all shadow-sm group">
                  <div className="h-14 w-14 bg-muted rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Camera className="h-6 w-6 text-foreground group-hover:text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">Scan QR</span>
                </button>
              </div>
            )}

            {cameraError && (
              <div className="border border-destructive/20 bg-destructive/10 text-destructive p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{cameraError}</p>
                  <Button size="sm" variant="outline" onClick={() => { setCameraError(""); setUpiMethod("id"); }} className="mt-3 text-xs h-8 bg-card hover:bg-destructive/5 text-destructive">
                    Enter ID manually
                  </Button>
                </div>
              </div>
            )}

            {upiMethod === "id" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <Input placeholder="merchant@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="h-16 text-center text-lg bg-card border-border placeholder:text-muted-foreground/50 font-mono font-medium rounded-xl shadow-sm" autoFocus />
              </motion.div>
            )}

            {scanning && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div ref={scanContainerRef} className="relative bg-black rounded-2xl overflow-hidden aspect-square max-w-[300px] mx-auto border border-border shadow-sm">
                  <div id="upi-qr-reader" className="w-full h-full" />
                </div>
                <Button variant="outline" onClick={stopScan} className="w-full h-14 rounded-xl bg-card hover:bg-muted text-foreground">
                  Cancel Scan
                </Button>
              </motion.div>
            )}

            {upiMethod === "qr" && !scanning && upiId && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                <p className="text-xs font-mono text-primary uppercase tracking-widest font-bold">Scanned UPI ID</p>
                <p className="font-display text-xl font-bold text-foreground mt-1">{upiId}</p>
              </motion.div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => { setStep(1); setUpiMethod(null); setUpiId(""); stopScan(); }} className="h-14 px-6 rounded-xl bg-card text-foreground hover:bg-muted">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!canProceed()} className="flex-1 h-14 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="font-display text-2xl font-bold text-foreground">Confirm Payment</h3>
            </div>

            <div className="surface-card rounded-2xl overflow-hidden border border-border">
              <div className="bg-muted px-6 py-3 border-b border-border">
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground text-center">Order Summary</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">You Send</span>
                  <span className="font-display text-2xl font-bold text-foreground">{solAmount} SOL</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Recipient Gets</span>
                  <span className="font-display text-2xl font-bold text-primary">
                    ₹{Math.round(inrAmount).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-muted-foreground">UPI ID</span>
                  <span className="text-sm font-semibold text-foreground truncate max-w-[180px]">{upiId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Rate</span>
                  <span className="text-sm font-medium text-foreground">1 SOL = ₹{SOL_PRICE}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Network</span>
                  <Badge variant="outline" className="text-[10px] bg-accent text-accent-foreground border-border">DEVNET</Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="h-14 px-6 rounded-xl bg-card text-foreground hover:bg-muted">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={sending || !isConnected || !ready}
                className="flex-1 h-14 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {sending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</>
                ) : (
                  <><Shield className="mr-2 h-5 w-5" />Pay {solAmount} SOL</>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring" }} className="space-y-6 text-center py-6">
            <div className="mx-auto w-24 h-24 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center shadow-sm mb-8">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>

            <div>
              <h3 className="font-display text-3xl font-bold text-foreground">Payment Sent</h3>
              <p className="text-muted-foreground text-sm mt-3 font-medium leading-relaxed px-4">
                CruPay will route ₹{Math.round(inrAmount).toLocaleString("en-IN")} to <span className="text-foreground font-semibold">{upiId}</span>.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 text-left space-y-3 mt-6 shadow-sm">
              <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground font-medium">Order</span><span className="font-mono text-xs text-foreground bg-muted px-2 py-1 rounded-md">{orderId}</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground font-medium">Status</span><Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">PROCESSING</Badge></div>
            </div>

            <Button onClick={reset} variant="outline" className="w-full h-14 mt-4 font-semibold rounded-xl bg-card text-foreground hover:bg-muted">
              <FileText className="mr-2 h-4 w-4" /> Make Another Payment
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}