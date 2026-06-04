"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WalletButton } from "@/components/wallet/wallet-button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  FileText,
  QrCode,
  History,
  User,
  Smartphone,
  Menu,
  LineChart
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/receive", label: "Receive", icon: QrCode },
  { href: "/transactions", label: "History", icon: History },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/profile", label: "Profile", icon: User },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img src="/logo.svg" alt="CruPay Logo" width={40} height={40} className="rounded-xl shadow-sm" />
      <span className="font-display font-bold text-xl tracking-tight text-foreground">CruPay</span>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex flex-col w-[280px] bg-background h-screen sticky top-0 border-r border-border z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex h-24 items-center px-8 border-b border-border bg-surface-1">
        <Link href="/dashboard"><Logo /></Link>
      </div>
      <ScrollArea className="flex-1 py-8 px-5">
        <nav className="grid gap-3">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-4 mb-2">Controls</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-[15px] font-bold transition-all duration-200",
                pathname === item.href
                  ? "surface-card text-foreground"
                  : "text-muted-foreground hover:bg-surface-3 hover:text-foreground"
              )}
            >
              <div className={cn("p-2 rounded-xl transition-colors shadow-sm border border-transparent", pathname === item.href ? "bg-primary text-white border-[#E64320] shadow-[inset_0_2px_2px_rgba(255,255,255,0.3)]" : "surface-inset text-muted-foreground group-hover:text-foreground")}>
                <item.icon className="h-4 w-4" />
              </div>
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator className="my-8 mx-5 w-auto bg-border" />
        <div className="grid gap-3">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-4 mb-2">External</p>
          <Link
            href="/lite"
            className={cn(
              "group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-[15px] font-bold transition-all duration-200",
              pathname === "/lite"
                ? "surface-card text-foreground"
                : "text-muted-foreground hover:bg-surface-3 hover:text-foreground"
            )}
          >
            <div className={cn("p-2 rounded-xl transition-colors shadow-sm border border-transparent", pathname === "/lite" ? "bg-primary text-white border-[#E64320] shadow-[inset_0_2px_2px_rgba(255,255,255,0.3)]" : "surface-inset text-muted-foreground group-hover:text-foreground")}>
              <Smartphone className="h-4 w-4" />
            </div>
            Lite Scanner
          </Link>
        </div>
      </ScrollArea>
      <div className="border-t border-border p-6 bg-surface-1 flex gap-2">
        <div className="flex-1"><WalletButton /></div>
        <ThemeToggle />
      </div>
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden flex h-20 items-center justify-between bg-surface-1 border-b border-border px-6 sticky top-0 z-50">
      <Link href="/dashboard"><Logo /></Link>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <WalletButton />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <button className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-foreground surface-card rounded-xl shadow-sm border border-transparent")} />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 bg-background border-r border-border">
            <div className="flex h-20 items-center px-8 border-b border-border bg-surface-1"><Logo /></div>
            <ScrollArea className="flex-1 py-8 px-5">
              <nav className="grid gap-3">
                <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-4 mb-2">Controls</p>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-[15px] font-bold transition-all duration-200",
                      pathname === item.href
                        ? "surface-card text-foreground"
                        : "text-muted-foreground hover:bg-surface-3 hover:text-foreground"
                    )}
                  >
                    <div className={cn("p-2 rounded-xl transition-colors shadow-sm border border-transparent", pathname === item.href ? "bg-primary text-white border-[#E64320] shadow-[inset_0_2px_2px_rgba(255,255,255,0.3)]" : "surface-inset text-muted-foreground group-hover:text-foreground")}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    {item.label}
                  </Link>
                ))}
                <Separator className="my-8 mx-5 w-auto bg-border" />
                <div className="grid gap-3">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-4 mb-2">External</p>
                  <Link
                    href="/lite"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-[15px] font-bold transition-all duration-200",
                      pathname === "/lite"
                        ? "surface-card text-foreground"
                        : "text-muted-foreground hover:bg-surface-3 hover:text-foreground"
                    )}
                  >
                    <div className={cn("p-2 rounded-xl transition-colors shadow-sm border border-transparent", pathname === "/lite" ? "bg-primary text-white border-[#E64320] shadow-[inset_0_2px_2px_rgba(255,255,255,0.3)]" : "surface-inset text-muted-foreground group-hover:text-foreground")}>
                      <Smartphone className="h-4 w-4" />
                    </div>
                    Lite Scanner
                  </Link>
                </div>
              </nav>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
