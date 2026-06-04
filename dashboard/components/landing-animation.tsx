"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Shield, Search, IndianRupee, FileText, CheckCircle, ArrowRight, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 5);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full relative min-h-[650px] flex items-center justify-center pt-10 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full max-w-5xl relative z-10 px-4">
        
        {/* Left Side: The User's Phone (iPhone Style) */}
        <div className="relative w-[320px] h-[640px] bg-background border-[12px] border-[#1A1A1A] dark:border-[#2A2A2A] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden shrink-0">
          
          {/* iPhone Dynamic Island / Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-[#1A1A1A] dark:bg-[#2A2A2A] rounded-full z-50 flex items-center justify-end px-3 shadow-inner">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>

          <div className="flex-1 bg-surface-1 flex flex-col relative pt-12 pb-4 px-4 h-full">
            <AnimatePresence mode="wait">
              
              {/* Step 0: Phone Scanning */}
              {step === 0 && (
                <motion.div key="p0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full justify-between">
                  <div className="text-center pt-4">
                    <p className="font-display font-black text-2xl text-foreground">Scan to Pay</p>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2">Align QR code in frame</p>
                  </div>
                  
                  <div className="relative w-full aspect-square surface-inset rounded-[2rem] flex items-center justify-center overflow-hidden mb-10 shadow-inner border border-border">
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiPjwvcmVjdD48cGF0aCBkPSJNMCAwTDggOFpNOSAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9zdmc+')] mix-blend-overlay" />
                    
                    <div className="w-48 h-48 border-[3px] border-primary/40 border-dashed rounded-3xl relative overflow-hidden flex items-center justify-center">
                      <motion.div 
                        animate={{ top: ['-10%', '110%'] }} 
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_#FF5A36] z-20"
                      />
                      <QrCode className="h-16 w-16 text-foreground/10" />
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full rounded-full h-14 btn-tactile-secondary font-bold uppercase tracking-widest text-xs" disabled>
                    Cancel Scan
                  </Button>
                </motion.div>
              )}

              {/* Step 1 & 2: Sending SOL */}
              {(step === 1 || step === 2) && (
                <motion.div key="p1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col h-full space-y-6 justify-center">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-white border border-border rounded-[1.2rem] flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <img src="/logo.svg" alt="CruPay" className="w-12 h-12" />
                    </div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Paying Merchant</p>
                  </div>
                  <div className="surface-card border border-border p-6 rounded-[2rem] text-center space-y-4 shadow-sm">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">You Send</p>
                      <p className="font-display text-4xl text-foreground font-black tracking-tighter">5.00 <span className="text-lg text-muted-foreground">SOL</span></p>
                    </div>
                    <div className="h-px bg-border w-full" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">They Receive</p>
                      <p className="font-display text-2xl font-black text-accent">₹75,000</p>
                    </div>
                  </div>
                  <Button className="w-full h-16 rounded-full btn-tactile-primary text-sm font-bold uppercase tracking-widest mt-auto" disabled>
                    {step === 1 ? "Confirm & Send" : "Sending..."}
                  </Button>
                </motion.div>
              )}

              {/* Step 3 & 4: Paid */}
              {(step === 3 || step === 4) && (
                <motion.div key="p3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full items-center justify-center text-center space-y-8">
                  <div className="h-32 w-32 bg-status-success-bg rounded-full flex items-center justify-center shadow-inner relative">
                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}>
                       <CheckCircle className="h-16 w-16 text-status-success-text" />
                     </motion.div>
                  </div>
                  <div>
                    <h3 className="font-display text-4xl font-black text-foreground">Sent!</h3>
                    <p className="text-sm text-muted-foreground mt-3 font-medium px-4">CruPay routed ₹75,000 to <span className="font-bold text-foreground">merchant@upi</span>.</p>
                  </div>
                  <Button className="w-full h-14 rounded-full btn-tactile-secondary text-sm font-bold uppercase tracking-widest mt-8" disabled>
                    Done
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Phone Home Bar */}
          <div className="absolute bottom-2 inset-x-0 flex items-center justify-center z-50">
            <div className="h-1 w-1/3 bg-foreground/20 rounded-full" />
          </div>
        </div>

        {/* Middle: Data Flow & Matchmaking */}
        <div className="hidden md:flex flex-col items-center justify-center gap-6 px-4">
          <AnimatePresence mode="wait">
            {step === 0 && <motion.div key="m0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted-foreground/30"><ArrowRight className="h-10 w-10" /></motion.div>}
            {step === 1 && (
              <motion.div key="m1" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="surface-card p-4 rounded-full shadow-md border border-border">
                <Shield className="h-8 w-8 text-primary" />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="m2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                <div className="surface-card p-5 rounded-[1.5rem] shadow-md border border-primary/20 flex items-center gap-3">
                  <Search className="h-5 w-5 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-primary">Matching</span>
                </div>
                <div className="h-16 w-1 bg-gradient-to-b from-primary to-accent rounded-full" />
                <div className="surface-card p-5 rounded-[1.5rem] shadow-md border border-accent/20 flex items-center gap-3">
                  <IndianRupee className="h-5 w-5 text-accent" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-accent">Liquidity Found</span>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="m3" initial={{ width: 0, opacity: 0 }} animate={{ width: 120, opacity: 1 }} exit={{ opacity: 0 }} className="h-2.5 bg-accent rounded-full shadow-[0_0_15px_rgba(45,90,76,0.3)] overflow-hidden relative">
                <div className="absolute inset-0 bg-white/50 animate-pulse" />
              </motion.div>
            )}
            {step === 4 && <motion.div key="m4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-accent/60"><ArrowRight className="h-10 w-10" /></motion.div>}
          </AnimatePresence>
        </div>

        {/* Right Side: Merchant Terminal / Store */}
        <div className="relative w-[300px] h-[480px] surface-card rounded-[2.5rem] shadow-2xl flex flex-col shrink-0 border-t-[12px] border-x-[6px] border-b-[24px] border-[#D5D5CF] dark:border-[#2A2A28] overflow-hidden">
           
           {/* Merchant Screen */}
           <div className="flex-1 bg-[#111111] p-6 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiPjwvcmVjdD48cGF0aCBkPSJNMCAwTDggOFpNOSAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9zdmc+')] mix-blend-overlay pointer-events-none" />
             
             <div className="flex justify-between items-center z-10 border-b border-white/10 pb-4">
               <span className="font-mono text-xs font-bold text-white/50 tracking-widest uppercase">STORE POS</span>
               <div className="flex gap-1.5">
                 <div className="h-1.5 w-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]" />
                 <div className="h-1.5 w-1.5 bg-white/20 rounded-full" />
                 <div className="h-1.5 w-1.5 bg-white/20 rounded-full" />
               </div>
             </div>

             <AnimatePresence mode="wait">
               {(step === 0 || step === 1 || step === 2) && (
                 <motion.div key="m_wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center z-10 my-auto flex flex-col items-center">
                   <div className="bg-white p-4 rounded-[1.5rem] inline-block mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                     <QrCode className="h-28 w-28 text-black" />
                   </div>
                   <p className="font-mono text-xs text-white/60 font-bold tracking-widest uppercase">Waiting for Payment</p>
                   <p className="font-display text-4xl text-white font-black mt-2">₹75,000</p>
                 </motion.div>
               )}

               {step === 3 && (
                 <motion.div key="m_recv" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center z-10 my-auto space-y-6">
                   <div className="h-20 w-20 border-[6px] border-t-accent border-white/10 rounded-full animate-spin mx-auto" />
                   <p className="font-mono text-xs text-accent font-bold tracking-widest uppercase animate-pulse">Receiving Settlement...</p>
                 </motion.div>
               )}

               {step === 4 && (
                 <motion.div key="m_done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10 my-auto bg-accent/10 border border-accent/30 p-8 rounded-[2rem] ">
                   <CheckCircle className="h-14 w-14 text-accent mx-auto mb-4" />
                   <p className="font-display text-4xl text-white font-black">PAID</p>
                   <p className="font-mono text-[10px] text-white/50 mt-2 font-bold uppercase tracking-widest">via CruPay P2P</p>
                   
                   <motion.div 
                     initial={{ opacity: 0, y: -10 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     transition={{ delay: 0.5 }}
                     className="mt-6 pt-5 border-t border-white/10"
                   >
                     <div className="flex items-center justify-between text-[10px] font-mono text-white/50 font-bold tracking-widest">
                       <span>RECEIPT</span>
                       <span>#INV-089</span>
                     </div>
                   </motion.div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
           
           {/* Hardware Receipt Slot Animation */}
           <div className="absolute bottom-0 inset-x-0 h-1 bg-[#0A0A0A] z-20 flex justify-center overflow-hidden">
             {step === 4 && (
               <motion.div 
                 initial={{ height: 0, y: 0 }} 
                 animate={{ height: "40px", y: 40 }} 
                 transition={{ duration: 1.5, delay: 0.8 }}
                 className="w-3/4 bg-white shadow-md relative"
               >
                 <div className="absolute top-0 w-full border-t-[3px] border-dashed border-gray-300" />
               </motion.div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}