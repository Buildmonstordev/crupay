"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { generatePaymentQR, qrToDataURL } from "@/lib/solana-pay";
import { QrCode, Copy, Check, ArrowRight, ArrowLeft, CheckCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

const steps = [
  { number: 1, label: "Amount" },
  { number: 2, label: "Details" },
  { number: 3, label: "QR Code" },
];

export default function ReceivePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");
  const [description, setDescription] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canProceed = () => {
    if (currentStep === 1) return amount && parseFloat(amount) > 0;
    return true;
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      try {
        const recipient = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";
        const qr = generatePaymentQR(recipient, parseFloat(amount), 300, undefined, "CruPay Merchant", description);
        const dataUrl = await qrToDataURL(qr);
        setQrDataUrl(dataUrl);

        const { encodeURL } = await import("@solana/pay");
        const { address } = await import("@solana/kit");
        const url = encodeURL({
          recipient: address(recipient),
          amount: parseFloat(amount),
          label: "CruPay Merchant",
          message: description,
        });
        setPaymentUrl(url.toString());
      } catch {
        toast.error("Failed to generate QR");
        return;
      }
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const reset = () => {
    setCurrentStep(1);
    setAmount("");
    setToken("USDC");
    setDescription("");
    setQrDataUrl(null);
    setPaymentUrl(null);
    setCopied(false);
  };

  const copyUrl = () => {
    if (paymentUrl) {
      navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("URL copied!");
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Receive</h1>
          <p className="text-muted-foreground mt-1 font-medium">Generate Solana Pay links and QR codes</p>
        </motion.div>

        <Card className="surface-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-border bg-card px-8 py-6 rounded-t-[inherit]">
            <CardTitle className="font-display text-xl font-bold text-foreground">Generate Payment Link</CardTitle>
          </CardHeader>
          <CardContent className="p-8 bg-surface-1">
            {/* Step indicator */}
            <div className="flex gap-2 mb-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${currentStep >= s ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="r1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-3">
                    <Label className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">How much do you want to receive?</Label>
                    <div className="flex gap-4">
                      <Input type="text" inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => { if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value); }} className="h-20 text-4xl text-center bg-card border border-border rounded-2xl font-display font-bold text-foreground shadow-sm flex-1" />
                      <div className="w-32">
                         <select value={token} onChange={(e) => setToken(e.target.value)} className="w-full h-20 rounded-2xl border border-border bg-card shadow-sm px-4 text-lg font-bold text-foreground appearance-none text-center outline-none focus:border-primary focus:ring-1 focus:ring-primary/30">
                           <option value="USDC">USDC</option>
                           <option value="SOL">SOL</option>
                         </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="r2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">What is this for?</Label>
                    <Input placeholder="Payment for services..." value={description} onChange={(e) => setDescription(e.target.value)} className="h-16 font-medium text-base bg-card border border-border rounded-xl text-foreground shadow-sm placeholder:text-muted-foreground/60" />
                  </div>
                  <div className="border border-border bg-card rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center"><span className="text-muted-foreground text-sm font-medium">Amount</span><span className="font-display font-bold text-2xl text-foreground">{amount} {token}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground text-sm font-medium">Network</span><Badge variant="outline" className="text-[10px] font-mono bg-accent text-accent-foreground border-border">DEVNET</Badge></div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="r3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                  <div className="text-center space-y-4">
                    {qrDataUrl ? (
                      <div className="inline-block p-4 rounded-3xl bg-card shadow-sm border border-border">
                        <img src={qrDataUrl} alt="Payment QR" className="rounded-2xl" width={220} height={220} />
                      </div>
                    ) : (
                      <div className="w-[252px] h-[252px] rounded-3xl bg-card border border-border shadow-sm flex items-center justify-center mx-auto">
                        <QrCode className="h-12 w-12 text-muted-foreground animate-pulse" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-display text-2xl font-bold text-foreground">Scan to Pay</h3>
                      <p className="text-muted-foreground text-sm font-medium mt-1">Share this QR code with your customer</p>
                    </div>
                  </div>
                  {paymentUrl && (
                    <div className="bg-card rounded-2xl p-5 border border-border space-y-2 shadow-sm">
                      <p className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">Payment URL</p>
                      <p className="text-xs font-mono text-foreground font-semibold break-all">{paymentUrl}</p>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <Button onClick={copyUrl} variant="outline" className="flex-1 h-14 font-semibold rounded-xl border-border bg-card text-foreground hover:bg-muted transition-colors shadow-sm">
                      {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      {copied ? "Copied" : "Copy URL"}
                    </Button>
                    <Button onClick={reset} className="flex-1 h-14 font-semibold rounded-xl btn-primary shadow-sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      New QR
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {currentStep < 3 && (
              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handleBack} className="h-14 px-6 rounded-xl border-border bg-card text-foreground hover:bg-muted shadow-sm">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <Button onClick={handleNext} disabled={!canProceed()} className="flex-1 h-14 text-base font-semibold rounded-xl btn-primary shadow-sm">
                  {currentStep === 2 ? "Generate QR" : "Continue"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
