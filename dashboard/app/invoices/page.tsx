"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SolanaPayPopup } from "@/components/pay/solana-pay-popup";
import { generatePaymentURL } from "@/lib/solana-pay";
import {
  FileText, Clock, CheckCircle, XCircle, Wallet, Download,
  IndianRupee, Plus, ArrowRight, ArrowLeft, Copy, Check,
} from "lucide-react";
import { toast } from "sonner";

interface Invoice {
  id: string;
  upiId: string;
  description: string;
  inrAmount: number;
  solAmount: number;
  status: "pending" | "paid" | "expired";
  createdAt: string;
  payUrl: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV-001", upiId: "freelancer@upi", description: "Logo design", inrAmount: 2500, solAmount: 16.67, status: "paid", createdAt: "2026-05-01", payUrl: "" },
    { id: "INV-002", upiId: "merchant@okaxis", description: "Server hosting", inrAmount: 500, solAmount: 3.33, status: "pending", createdAt: "2026-05-05", payUrl: "" },
  ]);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [view, setView] = useState<"list" | "create">("list");

  const [step, setStep] = useState(1);
  const [solAmount, setSolAmount] = useState("");
  const [description, setDescription] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    if (!solAmount || parseFloat(solAmount) <= 0) { toast.error("Enter a SOL amount"); return; }
    try {
      const addr = recipientAddress || "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";
      const url = generatePaymentURL(addr, parseFloat(solAmount), undefined, "CruPay Invoice", description);
      setGeneratedUrl(url.toString());
      const inv: Invoice = {
        id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
        upiId: "—",
        description: description || "Invoice payment",
        inrAmount: parseFloat(solAmount) * 150,
        solAmount: parseFloat(solAmount),
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
        payUrl: url.toString(),
      };
      setInvoices([inv, ...invoices]);
      setStep(3);
      toast.success("Invoice created!");
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  const resetCreate = () => {
    setView("list");
    setStep(1);
    setSolAmount("");
    setDescription("");
    setRecipientAddress("");
    setGeneratedUrl("");
    setCopied(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied!");
  };

  const statusColor = (s: string) => s === "paid" ? "bg-status-success-bg text-accent shadow-none border-none" : s === "pending" ? "bg-status-warning-bg text-status-warning-text shadow-none border-none" : "bg-muted text-muted-foreground shadow-none border-none";
  const statusIcon = (s: string) => s === "paid" ? <CheckCircle className="h-4 w-4" /> : s === "pending" ? <Clock className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;

  return (
    <DashboardShell>
      <div className="space-y-10 max-w-4xl mx-auto pb-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl font-black tracking-tighter">Invoices</h1>
            <p className="text-muted-foreground mt-2 font-medium text-lg">
              {view === "list" ? "Manage and pay invoices" : "Create a new invoice"}
            </p>
          </div>
          {view === "list" ? (
            <Button onClick={() => setView("create")} className="h-12 px-6 rounded-full btn-tactile-primary font-bold shadow-sm transition-all text-base">
              <Plus className="mr-2 h-5 w-5" /> New Invoice
            </Button>
          ) : (
            <Button variant="outline" onClick={resetCreate} className="h-12 px-6 rounded-full bg-card text-foreground hover:bg-muted transition-colors font-bold text-base shadow-sm border border-border">
              <ArrowLeft className="mr-2 h-5 w-5" /> Back
            </Button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {view === "create" ? (
            <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="surface-card rounded-[2.5rem] overflow-hidden p-0 h-full border-none">
                <div className="h-full flex flex-col bg-surface-2">
                  <CardHeader className="border-b border-border bg-surface-1 px-8 py-6">
                    <CardTitle className="font-display text-2xl font-black text-foreground">Create Invoice</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 bg-surface-1 flex-1">
                    {/* Progress */}
                    <div className="flex gap-2 mb-10">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-primary shadow-[inset_0_2px_2px_rgba(255,255,255,0.3)]" : "surface-inset"}`} />
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div key="c1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                          <div className="space-y-3">
                            <Label className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount (SOL)</Label>
                            <Input type="text" inputMode="decimal" placeholder="0.00" value={solAmount} onChange={(e) => { if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) setSolAmount(e.target.value); }} className="h-24 text-5xl text-center bg-card rounded-2xl font-display font-black text-foreground shadow-sm border-none" />
                            {solAmount && <p className="text-center font-mono font-bold text-sm mt-2 text-primary">≈ ₹{(parseFloat(solAmount) * 150).toLocaleString("en-IN")}</p>}
                          </div>
                          <div className="space-y-3">
                            <Label className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                            <Input placeholder="What is this invoice for?" value={description} onChange={(e) => setDescription(e.target.value)} className="h-16 font-bold text-lg bg-card rounded-2xl border-none shadow-sm" />
                          </div>
                          <Button onClick={() => setStep(2)} disabled={!solAmount || parseFloat(solAmount) <= 0} className="w-full h-16 text-lg font-bold rounded-full btn-tactile-primary mt-6">
                            Continue<ArrowRight className="ml-2 h-6 w-6" />
                          </Button>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div key="c2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                          <div className="space-y-3">
                            <Label className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Recipient Wallet (Optional)</Label>
                            <Input placeholder="Leave blank for default" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} className="h-16 font-mono text-base bg-card rounded-2xl border-none text-foreground placeholder:text-muted-foreground/50 shadow-sm" />
                          </div>
                          
                          <div className="surface-card rounded-2xl p-6 space-y-5">
                            <div className="flex justify-between items-center border-b border-border pb-4"><span className="text-muted-foreground text-sm font-bold uppercase tracking-widest font-mono">Amount</span><span className="font-display font-black text-3xl text-foreground">{solAmount} SOL</span></div>
                            <div className="flex justify-between pt-1"><span className="text-muted-foreground text-sm font-bold uppercase tracking-widest font-mono">Description</span><span className="text-right truncate max-w-[200px] text-foreground text-base font-bold">{description || "—"}</span></div>
                            <div className="flex justify-between pt-1"><span className="text-muted-foreground text-sm font-bold uppercase tracking-widest font-mono">Network</span><Badge variant="outline" className="bg-surface-hover text-muted-foreground border-none text-xs font-mono font-bold shadow-none">DEVNET</Badge></div>
                          </div>

                          <div className="flex gap-4 pt-4">
                            <Button variant="outline" onClick={() => setStep(1)} className="h-16 px-8 font-bold rounded-full btn-tactile-secondary text-foreground"><ArrowLeft className="h-6 w-6" /></Button>
                            <Button onClick={handleCreate} className="flex-1 h-16 text-lg font-bold rounded-full btn-tactile-primary">Create Invoice<ArrowRight className="ml-2 h-6 w-6" /></Button>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div key="c3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center py-8">
                          <div className="mx-auto w-24 h-24 rounded-[1rem] surface-inset flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-display text-4xl font-black text-foreground tracking-tight">Created!</h3>
                            <p className="text-muted-foreground text-base mt-2 font-medium">Share the link or let someone pay via the popup</p>
                          </div>
                          <div className="surface-card p-6 rounded-2xl text-left font-mono space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-primary">Payment Link</p>
                            <p className="text-sm font-bold text-foreground break-all surface-inset p-4 rounded-xl">{generatedUrl}</p>
                          </div>
                          <div className="flex gap-4 pt-4">
                            <Button variant="outline" onClick={copyUrl} className="flex-1 h-16 font-bold text-base rounded-full btn-tactile-secondary">
                              {copied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                              {copied ? "Copied" : "Copy Link"}
                            </Button>
                            <Button onClick={resetCreate} className="flex-1 h-16 font-bold text-base rounded-full btn-tactile-primary">Done</Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: "PAID", count: invoices.filter((i) => i.status === "paid").length, color: "text-accent", bg: "surface-card" },
                  { label: "PENDING", count: invoices.filter((i) => i.status === "pending").length, color: "text-status-warning-text", bg: "surface-card" },
                  { label: "TOTAL", count: invoices.length, color: "text-primary", bg: "surface-card" },
                ].map((s) => (
                  <div key={s.label} className={`rounded-3xl p-6 text-center transition-all ${s.bg}`}>
                    <p className={`font-display text-5xl font-black ${s.color}`}>{s.count}</p>
                    <p className={`font-mono text-[11px] font-bold uppercase tracking-widest mt-2 text-muted-foreground`}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Invoice list */}
              <div className="space-y-4">
                {invoices.map((invoice, i) => (
                  <motion.div key={invoice.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="surface-card rounded-[2rem] p-6 hover:-translate-y-1 transition-transform group flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-[1rem] surface-inset flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-display font-black text-2xl text-foreground">{invoice.id}</span>
                            <Badge className={`px-3 py-1 text-[10px] font-mono font-bold uppercase ${statusColor(invoice.status)}`}>
                              {invoice.status}
                            </Badge>
                          </div>
                          <p className="font-medium text-base text-muted-foreground mt-1.5 truncate max-w-[300px]">{invoice.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 pt-4 md:pt-0 justify-between md:justify-end border-t border-border md:border-none">
                        <div className="text-left md:text-right">
                          <p className="font-display text-3xl font-black text-foreground">{invoice.solAmount} SOL</p>
                          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center md:justify-end gap-1 mt-1.5">
                            <IndianRupee className="h-3.5 w-3.5" />{invoice.inrAmount.toLocaleString("en-IN")}
                          </p>
                        </div>
                        {invoice.status === "pending" && (
                          <Button size="lg" onClick={() => setPayingInvoice(invoice)} className="h-12 px-6 rounded-full font-bold text-sm btn-tactile-primary">
                            <Wallet className="mr-2 h-5 w-5" /> PAY NOW
                          </Button>
                        )}
                        {invoice.status === "paid" && (
                          <Button size="lg" variant="outline" className="h-12 px-6 rounded-full font-bold text-sm btn-tactile-secondary">
                            <Download className="mr-2 h-5 w-5" /> PDF
                          </Button>
                        )}
                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SolanaPayPopup
        open={!!payingInvoice}
        onOpenChange={(open) => { if (!open) setPayingInvoice(null); }}
        amount={payingInvoice?.solAmount || 0}
        label={`CruPay Invoice ${payingInvoice?.id || ""}`}
        description={payingInvoice?.description}
      />
    </DashboardShell>
  );
}
