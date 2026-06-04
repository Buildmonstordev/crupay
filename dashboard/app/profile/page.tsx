"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useWallet, useCluster, useConnector } from "@solana/connector/react";
import { Badge } from "@/components/ui/badge";
import { User, Wallet, Copy, Check, ArrowRight, ArrowLeft, CheckCircle, Globe, QrCode } from "lucide-react";
import { toast } from "sonner";

const steps = [
  { number: 1, label: "Account" },
  { number: 2, label: "UPI" },
  { number: 3, label: "Review" },
];

export default function ProfilePage() {
  const { isConnected, account } = useWallet();
  const { cluster, clusters, setCluster } = useCluster();
  const { disconnectWallet } = useConnector();
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [upiId, setUpiId] = useState("business@upi");
  const [businessName, setBusinessName] = useState("My Business");
  const [businessType, setBusinessType] = useState("business");

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Address copied!");
    }
  };

  const handleSave = () => {
    toast.success("Profile saved successfully!");
    setCurrentStep(3);
  };

  const reset = () => setCurrentStep(1);

  return (
    <DashboardShell>
      <div className="space-y-10 max-w-[1000px] mx-auto pb-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
          <h1 className="font-display text-5xl font-black tracking-tighter">Profile</h1>
          <p className="text-muted-foreground mt-2 font-medium text-lg">Manage your wallet, UPI settings, and business details</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <Card className="lg:col-span-4 surface-card rounded-[2.5rem] overflow-hidden p-0 h-full border-none">
            <div className="h-full flex flex-col bg-surface-2">
              <CardHeader className="border-b border-border bg-surface-1 px-6 py-5">
                <CardTitle className="font-display text-xl font-black text-foreground">Wallet</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-surface-1 flex-1">
                {isConnected && account ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="relative">
                        <Avatar className="h-24 w-24 surface-card p-1 shadow-sm">
                          <AvatarFallback className="bg-muted text-foreground text-3xl font-display font-black rounded-xl">
                            {account.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-accent border-[3px] border-[#F4F4F0] shadow-sm" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-foreground surface-card px-3 py-1.5 rounded-lg">{account.slice(0,6)}...{account.slice(-4)}</p>
                        <Button variant="ghost" size="sm" onClick={copyAddress} className="mt-3 text-muted-foreground hover:text-foreground font-bold">
                          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                          {copied ? "Copied" : "Copy Address"}
                        </Button>
                      </div>
                    </div>
                    <div className="surface-card rounded-2xl p-4 space-y-2">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Network</p>
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <span className="text-base font-bold text-foreground">{cluster?.label || "Unknown"}</span>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => disconnectWallet()} className="w-full h-14 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 font-bold transition-colors shadow-none">
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-20 h-20 rounded-[1.5rem] surface-inset flex items-center justify-center mb-6">
                      <Wallet className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-bold text-foreground">No wallet connected</p>
                    <p className="text-sm font-medium text-muted-foreground mt-2">Connect your wallet to manage settings.</p>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>

          <Card className="lg:col-span-8 surface-card rounded-[2.5rem] overflow-hidden p-0 h-full border-none">
            <div className="h-full flex flex-col bg-surface-2">
              <CardHeader className="border-b border-border bg-surface-1 px-8 py-6">
                <CardTitle className="font-display text-2xl font-black text-foreground">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-surface-1 flex-1">
                {/* Step indicator */}
                <div className="flex gap-2 mb-10">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-500 ${currentStep >= s ? "bg-primary shadow-[inset_0_2px_2px_rgba(255,255,255,0.3)]" : "surface-inset"}`} />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div key="p1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <div className="space-y-3">
                        <Label className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Type</Label>
                        <div className="grid grid-cols-3 gap-4">
                          {["individual", "business", "merchant"].map((t) => (
                            <button
                              key={t}
                              onClick={() => setBusinessType(t)}
                              className={`py-5 rounded-2xl border text-sm font-bold capitalize transition-all ${
                                businessType === t ? "border-primary/50 bg-primary/10 text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]" : "border-border bg-card text-muted-foreground hover:bg-muted shadow-sm"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Display Name</Label>
                        <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="h-16 font-bold text-lg bg-card rounded-2xl shadow-sm" />
                      </div>
                      <div className="space-y-3">
                        <Label className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Network</Label>
                        <div className="flex items-center gap-3 bg-card border border-border shadow-sm rounded-2xl p-4 h-16">
                          <Globe className="h-6 w-6 text-muted-foreground" />
                          <select
                            value={cluster?.id || ""}
                            onChange={(e) => setCluster(e.target.value as any)}
                            className="flex-1 bg-transparent text-lg font-bold text-foreground outline-none appearance-none"
                          >
                            {clusters.map((c) => (
                              <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div key="p2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <div className="space-y-3">
                        <Label className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">UPI ID</Label>
                        <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@upi" className="h-20 text-2xl bg-card border border-border shadow-sm rounded-2xl text-foreground font-mono font-bold" />
                        <p className="text-sm text-muted-foreground font-medium pt-2">This UPI ID will be used for receiving payouts automatically.</p>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div key="p3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center py-6">
                      <div className="mx-auto w-24 h-24 rounded-[1rem] surface-inset flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-display text-4xl font-black text-foreground tracking-tight">Profile Saved!</h3>
                        <p className="text-muted-foreground text-base mt-2 font-medium">Your settings have been updated successfully.</p>
                      </div>
                      <div className="surface-card rounded-2xl p-8 text-left space-y-5">
                        <div className="flex justify-between items-center"><span className="text-sm font-bold text-muted-foreground uppercase tracking-widest font-mono">Name</span><span className="font-bold text-foreground text-lg">{businessName}</span></div>
                        <div className="flex justify-between items-center"><span className="text-sm font-bold text-muted-foreground uppercase tracking-widest font-mono">Type</span><Badge variant="outline" className="capitalize text-xs surface-inset font-bold">{businessType}</Badge></div>
                        <div className="flex justify-between items-center"><span className="text-sm font-bold text-muted-foreground uppercase tracking-widest font-mono">UPI ID</span><span className="font-mono font-bold text-base text-foreground">{upiId}</span></div>
                        <div className="flex justify-between items-center"><span className="text-sm font-bold text-muted-foreground uppercase tracking-widest font-mono">Network</span><Badge variant="outline" className="text-xs bg-status-success-bg text-accent border-none shadow-none">{cluster?.label}</Badge></div>
                      </div>
                      <Button onClick={reset} className="w-full h-16 rounded-full font-bold text-lg btn-tactile-secondary">
                        <User className="mr-2 h-5 w-5" /> Edit Again
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {currentStep < 3 && (
                  <div className="flex gap-4 mt-12">
                    {currentStep > 1 && (
                      <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)} className="h-16 px-8 rounded-full btn-tactile-secondary">
                        <ArrowLeft className="h-6 w-6" />
                      </Button>
                    )}
                    <Button onClick={currentStep === 2 ? handleSave : () => setCurrentStep((s) => s + 1)} className="flex-1 h-16 text-lg font-bold rounded-full btn-tactile-primary">
                      {currentStep === 2 ? "Save Profile" : "Continue"}
                      {currentStep !== 2 && <ArrowRight className="ml-2 h-6 w-6" />}
                    </Button>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
