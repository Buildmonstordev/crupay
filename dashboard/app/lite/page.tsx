"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@solana/connector/react";
import { WalletButton } from "@/components/wallet/wallet-button";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { parseUpiQR, type ParsedUpiQR } from "@/lib/upi-qr";
import { Camera, Keyboard, ArrowLeft, Send, QrCode, CheckCircle, AlertCircle, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function LitePage() {
  const { isConnected, account } = useWallet();
  const [mode, setMode] = useState<"home" | "scan" | "manual" | "confirm" | "success">("home");
  const [scannedUpi, setScannedUpi] = useState<ParsedUpiQR | null>(null);
  const [manualUpiId, setManualUpiId] = useState("");
  const [cameraError, setCameraError] = useState("");
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch {}
        scannerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mode !== "scan") return;
    let cancelled = false;

    const initScanner = async () => {
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;
      const el = document.getElementById("qr-reader");
      if (!el || cancelled) return;

      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
          (text: string) => {
            const parsed = parseUpiQR(text);
            if (parsed) {
              setScannedUpi(parsed);
              toast.success("UPI scanned: " + parsed.upiId);
            } else {
              setScannedUpi({ upiId: text, raw: text });
              toast.success("QR scanned");
            }
            scanner.stop().catch(() => {});
            scannerRef.current = null;
            setMode("confirm");
          },
          () => {}
        );
      } catch (err: any) {
        if (cancelled) return;
        const msg = String(err?.message || err);
        if (msg.includes("NotAllowed") || msg.includes("Permission")) {
          setCameraError("Camera blocked. Please allow camera access in site settings.");
        } else {
          setCameraError("Could not start camera. Try entering UPI ID manually.");
        }
        setMode("manual");
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
  }, [mode]);

  const stopScanning = () => {
    if (scannerRef.current) {
      try { scannerRef.current.stop(); } catch {}
      scannerRef.current = null;
    }
    setMode("home");
  };

  const handleManualSubmit = () => {
    if (!manualUpiId) { toast.error("Enter a UPI ID"); return; }
    setScannedUpi({ upiId: manualUpiId, raw: manualUpiId });
    setMode("confirm");
  };

  const handlePay = () => {
    if (!isConnected) { toast.error("Connect wallet first"); return; }
    toast.success("Payment submitted!");
    setMode("success");
  };

  const reset = () => {
    setMode("home");
    setScannedUpi(null);
    setManualUpiId("");
    setCameraError("");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="mx-auto max-w-md px-5 py-8 relative z-10">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <img src="/logo.svg" alt="CruPay Logo" width={40} height={40} className="rounded-xl shadow-sm" />
            <span className="font-display font-bold text-xl tracking-tight text-foreground">LITE APP</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {mode !== "home" && mode !== "success" && (
              <Button variant="outline" size="sm" onClick={mode === "scan" ? stopScanning : () => setMode("home")} className="rounded-full btn-tactile-secondary font-bold h-10 px-4">
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
            )}
            <WalletButton />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="text-center space-y-4 py-8">
                <div className="mx-auto w-24 h-24 rounded-[1rem] surface-inset flex items-center justify-center shadow-inner">
                  <QrCode className="h-10 w-10 text-primary" />
                </div>
                <h2 className="font-display text-4xl font-black text-foreground tracking-tight">Scan & Pay</h2>
                <p className="text-base text-muted-foreground font-medium max-w-[260px] mx-auto">
                  Scan any UPI QR code and pay instantly with Solana.
                </p>
              </div>

              <div className="grid gap-5">
                <Button onClick={() => setMode("scan")} className="h-20 text-lg font-bold gap-4 rounded-full btn-tactile-primary">
                  <Camera className="h-6 w-6" />
                  Scan QR Code
                </Button>
                <Button variant="outline" onClick={() => setMode("manual")} className="h-20 text-lg font-bold gap-4 rounded-full btn-tactile-secondary">
                  <Keyboard className="h-6 w-6" />
                  Enter UPI ID
                </Button>
              </div>

              {isConnected && account ? (
                <div className="surface-card p-5 rounded-[1.5rem] flex items-center justify-between mt-8">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                    </span>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Connected</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] surface-inset">{account.slice(0, 6)}...{account.slice(-4)}</Badge>
                </div>
              ) : (
                <div className="surface-inset p-8 rounded-[2rem] text-center space-y-4 mt-8">
                  <p className="font-bold text-sm text-muted-foreground">Connect a wallet to proceed</p>
                  <WalletButton />
                </div>
              )}
            </motion.div>
          )}

          {mode === "scan" && (
            <motion.div key="scan" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
              <div className="text-center">
                <h3 className="font-display font-black text-2xl text-foreground">Scan UPI QR</h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">Point your camera at a merchant QR</p>
              </div>
              <div className="relative surface-card rounded-[2.5rem] p-4 aspect-square max-w-[320px] mx-auto">
                <div id="qr-reader" className="w-full h-full rounded-[2rem] overflow-hidden bg-black/5" />
                <div className="absolute inset-0 border-[6px] border-primary/20 rounded-[2.5rem] pointer-events-none" />
              </div>
              <Button variant="outline" onClick={stopScanning} className="w-full h-16 font-bold text-base rounded-full btn-tactile-secondary">
                Cancel Scan
              </Button>
            </motion.div>
          )}

          {mode === "manual" && (
            <motion.div key="manual" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center">
                <h3 className="font-display font-black text-2xl text-foreground">Enter UPI ID</h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">Type the merchant or recipient UPI ID</p>
              </div>
              {cameraError && (
                <div className="bg-status-error-bg border border-destructive/20 p-4 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive leading-relaxed font-bold">{cameraError}</p>
                </div>
              )}
              <Input placeholder="merchant@upi" value={manualUpiId} onChange={(e) => setManualUpiId(e.target.value)} className="h-20 bg-card text-center text-2xl font-mono font-bold rounded-2xl shadow-sm" autoFocus />
              <Button onClick={handleManualSubmit} disabled={!manualUpiId} className="w-full h-16 text-lg font-bold rounded-full btn-tactile-primary">
                Continue
              </Button>
            </motion.div>
          )}

          {mode === "confirm" && scannedUpi && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center">
                <h3 className="font-display font-black text-2xl text-foreground">Confirm Payment</h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">Review details and pay with SOL</p>
              </div>
              
              <Card className="surface-card rounded-[2rem] overflow-hidden p-0">
                <div className="bg-surface-1 overflow-hidden h-full flex flex-col">
                  <div className="bg-surface-2 border-b border-border px-6 py-4 text-center">
                     <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order Summary</p>
                  </div>
                  <div className="p-6 space-y-5 font-bold text-sm text-foreground">
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">UPI ID</span><span className="truncate max-w-[180px] font-mono text-xs surface-card px-2 py-1 rounded-md">{scannedUpi.upiId}</span></div>
                    {scannedUpi.name && <div className="flex justify-between items-center"><span className="text-muted-foreground">Name</span><span className="truncate max-w-[180px]">{scannedUpi.name}</span></div>}
                    
                    {scannedUpi.amount && (
                      <>
                        <div className="h-px bg-border my-2" />
                        <div className="flex justify-between items-center"><span className="text-muted-foreground">Amount</span><span className="font-display font-black text-3xl flex items-center gap-1"><IndianRupee className="h-5 w-5" />{scannedUpi.amount.toLocaleString("en-IN")}</span></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground">You Pay</span><span className="font-display font-black text-xl text-primary">~{(scannedUpi.amount / 150).toFixed(4)} SOL</span></div>
                      </>
                    )}
                    {scannedUpi.note && <div className="flex justify-between"><span className="text-muted-foreground">Note</span><span className="truncate max-w-[150px] font-medium italic text-muted-foreground">{scannedUpi.note}</span></div>}
                  </div>
                </div>
              </Card>

              <Button onClick={handlePay} disabled={!isConnected} className="w-full h-16 text-lg font-bold rounded-full btn-tactile-primary">
                <Send className="mr-3 h-6 w-6" /> Pay Now
              </Button>
              {!isConnected && <p className="text-center text-sm font-bold text-destructive bg-status-error-bg border border-destructive/20 py-3 rounded-xl">Connect wallet to pay</p>}
            </motion.div>
          )}

          {mode === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center py-10">
              <div className="mx-auto w-28 h-28 rounded-[1.5rem] surface-inset flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-4xl font-black text-foreground tracking-tight">Paid!</h3>
                <p className="text-muted-foreground text-base mt-3 font-medium leading-relaxed max-w-[240px] mx-auto">
                  CruPay will route{" "}
                  {scannedUpi?.amount && <span className="text-foreground font-bold">₹{scannedUpi.amount.toLocaleString("en-IN")}</span>}
                  {" "}to <span className="text-foreground font-mono text-xs surface-card px-2 py-1 rounded-md">{scannedUpi?.upiId}</span>.
                </p>
              </div>
              <Button onClick={reset} className="w-full h-16 text-base font-bold rounded-full btn-tactile-secondary mt-4">
                Scan Another QR
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}