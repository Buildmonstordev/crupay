"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LandingAnimation } from "@/components/landing-animation";
import {
  ArrowRight,
  Wallet,
  QrCode,
  Send,
  Shield,
  ChevronDown,
  Bot,
  Users,
  LineChart
} from "lucide-react";
import { toast } from "sonner";

export default function LandingPage() {
  const handlePreRegister = () => {
    toast.success("You are on the waitlist! You are user #25,001.");
  };
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      
      {/* Tactile Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/logo.svg" alt="CruPay Logo" width={40} height={40} className="rounded-xl shadow-sm group-hover:-translate-y-0.5 transition-transform shrink-0" />
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-foreground hidden xs:block sm:block">CruPay</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <a href="/llms.txt" target="_blank" rel="noreferrer">
                <Button variant="outline" className="hidden sm:flex px-4 font-bold tracking-wide h-11 rounded-full btn-tactile-secondary border-primary/20 text-primary">
                  <Bot className="mr-2 h-4 w-4" />
                  For Agents
                </Button>
              </a>
              <Link href="/analytics">
                <Button variant="outline" className="hidden sm:flex px-4 font-bold tracking-wide h-11 rounded-full btn-tactile-secondary">
                  <LineChart className="mr-2 h-4 w-4 text-muted-foreground" />
                  Traction
                </Button>
              </Link>
              <ThemeToggle />
              <Link href="/lite">
                <Button variant="outline" className="hidden md:flex px-6 font-bold tracking-wide h-11 rounded-full btn-tactile-secondary">
                  <QrCode className="mr-2 h-4 w-4 text-muted-foreground" />
                  Lite Scanner
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="h-11 font-bold tracking-wide px-4 sm:px-6 rounded-full btn-tactile-primary">
                  <span className="hidden sm:inline">Launch App</span>
                  <span className="sm:hidden">App</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 relative z-10 w-full flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full surface-inset px-5 py-2 text-xs font-mono font-bold text-foreground mb-4 border border-border shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-30" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="opacity-80">SYSTEM ONLINE</span> <span className="opacity-40 px-1">/</span> <span className="text-primary">DEVNET</span>
          </div>

          <h1 className="font-display text-7xl sm:text-[120px] lg:text-[140px] font-black tracking-tighter text-foreground leading-[0.85] drop-shadow-sm w-full">
            PHYSICAL <span className="text-primary relative inline-block">
              CRYPTO
              <svg className="absolute -bottom-2 sm:-bottom-4 left-0 w-full h-4 sm:h-6 text-accent" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,10 Q50,20 100,10" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </span> <br/>
            FOR THE REAL WORLD.
          </h1>

          <p className="text-xl sm:text-3xl text-muted-foreground font-medium max-w-3xl leading-relaxed mt-12">
            Send SOL or USDC directly to any UPI ID instantly. A tactile, trustless bridge built for actual humans.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12 w-full">
            <Button size="lg" onClick={handlePreRegister} className="w-full sm:w-auto h-20 text-xl font-bold px-12 rounded-full btn-tactile-primary hover:-translate-y-1">
              Pre-Register Now <Users className="ml-3 h-6 w-6" />
            </Button>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-20 text-xl font-bold px-12 rounded-full btn-tactile-secondary border-border hover:-translate-y-1">
                View Live Demo <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 mt-6">
            <div className="flex -space-x-3">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center surface-card overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=e2e2dc`} alt="avatar" />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-muted-foreground ml-2">Join <span className="text-foreground">25,000+</span> users already registered</p>
          </div>
          
          <div className="pt-24 animate-bounce text-muted-foreground/50">
            <ChevronDown className="h-10 w-10" />
          </div>
        </motion.div>
      </section>

      {/* Hardware Interface Mockup / Animation */}
      <section className="relative pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
         <LandingAnimation />
      </section>

      {/* Features Bento Grid */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10 bg-surface-2 border-y border-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-24 text-center max-w-4xl mx-auto">
            <h2 className="font-display text-5xl sm:text-8xl font-black tracking-tighter mb-8 text-foreground">
              HARDWARE-GRADE <br/> RELIABILITY.
            </h2>
            <p className="text-muted-foreground text-2xl font-medium leading-relaxed">
              We abstracted away the complexity of orderbooks and liquidity pools. You enter an amount, and the system clicks into place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[320px]">
            {/* Large Bento Box 1 */}
            <div className="surface-card p-12 rounded-[3rem] md:col-span-8 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="w-20 h-20 rounded-[1.5rem] surface-inset flex items-center justify-center mb-10 relative z-10">
                <Send className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-display text-4xl font-black mb-5 text-foreground tracking-tight relative z-10">Direct to UPI</h3>
              <p className="text-muted-foreground text-xl font-medium leading-relaxed max-w-lg relative z-10">
                Type an ID, enter amount, hit send. No complex bridges. The fiat lands directly in the recipient's bank account instantly.
              </p>
            </div>

            {/* Small Bento Box 1 */}
            <div className="surface-card p-10 rounded-[3rem] md:col-span-4 hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between">
              <div className="w-20 h-20 rounded-[1.5rem] surface-inset flex items-center justify-center">
                <QrCode className="h-10 w-10 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-3xl font-black mb-4 text-foreground tracking-tight">Universal Scanner</h3>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                  GPay, PhonePe, Paytm? Our Lite App scans any standard Indian QR code.
                </p>
              </div>
            </div>

            {/* Small Bento Box 2 */}
            <div className="surface-card p-10 rounded-[3rem] md:col-span-5 hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between">
              <div className="w-20 h-20 rounded-[1.5rem] surface-inset flex items-center justify-center">
                <Shield className="h-10 w-10 text-foreground" />
              </div>
              <div>
                <h3 className="font-display text-3xl font-black mb-4 text-foreground tracking-tight">Decentralized Verification</h3>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                  Trustless architecture. Smart contracts lock the crypto until the exact INR amount is fully verified.
                </p>
              </div>
            </div>

            {/* Large Bento Box 2 */}
            <div className="surface-card p-12 rounded-[3rem] md:col-span-7 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-transparent to-accent/5 pointer-events-none" />
               <div className="flex h-full flex-col justify-center">
                  <h3 className="font-display text-6xl font-black mb-6 text-foreground tracking-tighter uppercase">Zero Middlemen.</h3>
                  <p className="text-muted-foreground text-2xl font-medium leading-relaxed max-w-md">
                    We eliminate intermediaries. An automated smart escrow securely manages your funds, releasing them only upon verified settlement.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Massive CTA */}
      <section className="py-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-surface-2 border-t border-border">
        {/* Physical divots / screws in the corners for hardware feel */}
        <div className="absolute top-10 left-10 w-6 h-6 rounded-full surface-inset shadow-inner border border-border" />
        <div className="absolute top-10 right-10 w-6 h-6 rounded-full surface-inset shadow-inner border border-border" />
        <div className="absolute bottom-10 left-10 w-6 h-6 rounded-full surface-inset shadow-inner border border-border" />
        <div className="absolute bottom-10 right-10 w-6 h-6 rounded-full surface-inset shadow-inner border border-border" />
        
        <div className="mx-auto max-w-5xl text-center relative z-10">
          <h2 className="font-display text-7xl md:text-[100px] font-black tracking-tighter mb-12 leading-[0.9] text-foreground uppercase">
            DON'T WAIT. <br/> PRE-REGISTER.
          </h2>
          <Button size="lg" onClick={handlePreRegister} className="h-24 px-16 text-2xl font-bold rounded-full btn-tactile-primary hover:-translate-y-2 transition-all">
            <Users className="mr-4 h-8 w-8" /> Reserve Your Spot
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border mt-12 bg-background">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="CruPay Logo" width={48} height={48} className="rounded-xl shadow-sm" />
            <span className="font-display font-black text-2xl tracking-tight">CruPay</span>
          </div>
          <div className="text-base text-muted-foreground flex flex-wrap gap-10 font-bold font-mono uppercase tracking-widest">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/lite" className="hover:text-foreground transition-colors">Lite App</Link>
            <span className="opacity-30">Built on Solana</span>
          </div>
        </div>
      </footer>
    </div>
  );
}