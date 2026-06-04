"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Wallet, Receipt, Send, IndianRupee } from "lucide-react";

const transactions = [
  { id: "TX-001", type: "UPI Payout", amount: "245", token: "USDC", to: "merchant@upi", status: "completed", date: "2026-05-06", direction: "out" },
  { id: "TX-002", type: "Invoice Payment", amount: "1,200", token: "USDC", to: "0xabc...def", status: "completed", date: "2026-05-05", direction: "in" },
  { id: "TX-003", type: "Solana Pay", amount: "50", token: "SOL", to: "0xdef...abc", status: "pending", date: "2026-05-05", direction: "out" },
  { id: "TX-004", type: "UPI Payout", amount: "890", token: "SOL", to: "freelancer@upi", status: "completed", date: "2026-05-04", direction: "out" },
  { id: "TX-005", type: "Received", amount: "500", token: "USDC", to: "0x123...456", status: "completed", date: "2026-05-03", direction: "in" },
  { id: "TX-006", type: "Solana Pay", amount: "25", token: "SOL", to: "0x456...789", status: "completed", date: "2026-05-02", direction: "out" },
];

const typeIcons: Record<string, typeof Wallet> = {
  "UPI Payout": Send,
  "Invoice Payment": Receipt,
  "Solana Pay": Wallet,
  "Received": Wallet,
};

const filters = ["all", "in", "out", "upi", "solana"] as const;

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.to.toLowerCase().includes(search.toLowerCase()) ||
      tx.type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "in" && tx.direction === "in") ||
      (filter === "out" && tx.direction === "out") ||
      (filter === "upi" && tx.type === "UPI Payout") ||
      (filter === "solana" && tx.type === "Solana Pay");
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-[1000px] mx-auto pb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h1 className="font-display text-5xl font-black tracking-tighter">History</h1>
          <p className="text-muted-foreground mt-2 font-medium text-lg">View all your payments, invoices, and payouts</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 surface-inset border-none rounded-2xl font-mono text-sm text-foreground font-bold shadow-none"
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                filter === f
                  ? "bg-foreground border-foreground text-background shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f === "in" ? "Incoming" : f === "out" ? "Outgoing" : f === "upi" ? "UPI" : "Solana Pay"}
            </button>
          ))}
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] p-0 overflow-hidden bg-surface-1">
          <div className="divide-y divide-border/50">
            {filtered.map((tx, i) => {
              const Icon = typeIcons[tx.type] || Wallet;
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="p-6 hover:bg-surface-hover transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex items-center gap-5 flex-1">
                      <div
                        className={`h-14 w-14 rounded-[1rem] flex items-center justify-center shrink-0 surface-inset group-hover:bg-surface-1 group-hover:border-border transition-colors`}
                      >
                        <Icon className={`h-6 w-6 ${tx.direction === "in" ? "text-accent" : "text-primary"}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg text-foreground">{tx.type}</span>
                          <Badge variant="outline" className="text-[10px] font-mono bg-card border-none shadow-sm text-foreground">{tx.token}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium mt-1 truncate">
                          {tx.direction === "in" ? "From" : "To"} <span className="font-mono text-xs text-foreground bg-card px-1.5 py-0.5 rounded border border-border">{tx.to}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center sm:block justify-between mt-4 sm:mt-0 sm:text-right shrink-0 pt-4 sm:pt-0 border-t border-border/50 sm:border-0">
                      <p className={`font-display font-black text-2xl tracking-tighter ${tx.direction === "in" ? "text-foreground" : "text-foreground"}`}>
                        {tx.direction === "in" ? "+" : "-"}{tx.amount} <span className="text-lg text-muted-foreground">{tx.token}</span>
                      </p>
                      <div className="flex items-center sm:justify-end gap-3 mt-1.5">
                        <p className="font-mono text-[10px] text-muted-foreground font-bold uppercase tracking-widest hidden sm:block">
                          {tx.date}
                        </p>
                        <Badge
                          className={`text-[10px] border-none shadow-none px-3 py-1.5 font-bold ${
                            tx.status === "completed" ? "bg-status-success-bg text-accent" : "bg-status-warning-bg text-status-warning-text"
                          }`}
                        >
                          {tx.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}