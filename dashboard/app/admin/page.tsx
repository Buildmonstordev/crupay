"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  Loader2,
  RefreshCw,
  IndianRupee,
  Wallet,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  creatorAddress: string;
  upiId: string;
  inrAmount: number;
  cryptoAmount: number;
  token: string;
  description: string;
  status: string;
  escrowTx?: string;
  releaseTx?: string;
  createdAt: number;
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"pending" | "all" | "completed">("pending");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }

  async function processOrder(id: string, action: string) {
    setActionId(id);
    try {
      if (action === "complete") {
        await fetch(`/api/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "confirm" }),
        });
        const res = await fetch(`/api/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "complete" }),
        });
        const data = await res.json();
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Order completed! Escrow released.");
          fetchOrders();
        }
      } else {
        const res = await fetch(`/api/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        const data = await res.json();
        if (data.error) toast.error(data.error);
        else {
          toast.success(`Order ${action}ed`);
          fetchOrders();
        }
      }
    } catch {
      toast.error("Action failed");
    }
    setActionId(null);
  }

  const filtered = orders.filter((o) => {
    const matchSearch = o.upiId.includes(search) || o.id.includes(search) || o.creatorAddress.includes(search);
    if (filter === "pending") return matchSearch && (o.status === "escrowed" || o.status === "paid" || o.status === "confirmed");
    if (filter === "completed") return matchSearch && o.status === "completed";
    return matchSearch;
  });

  const pendingCount = orders.filter((o) => o.status === "escrowed" || o.status === "paid" || o.status === "confirmed").length;
  const todayVolume = orders
    .filter((o) => o.status === "completed" && o.createdAt > Date.now() - 86400000)
    .reduce((a, o) => a + o.inrAmount, 0);
  const totalProcessed = orders.filter((o) => o.status === "completed").reduce((a, o) => a + o.inrAmount, 0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Admin header */}
      <div className="border-b border-border bg-surface-1 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-display text-2xl font-black tracking-tighter text-foreground">CruPay Ops</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Devnet Processing Node</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={fetchOrders} className="font-bold uppercase text-xs rounded-full btn-tactile-secondary h-12 px-6">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="surface-card border-none shadow-xl rounded-[2.5rem] p-2">
            <CardContent className="p-6 bg-surface-2 surface-inset rounded-[2rem] h-full flex flex-col justify-center">
              <div className="w-14 h-14 bg-card rounded-[1rem] flex items-center justify-center mb-6 shadow-sm border border-border">
                <Clock className="h-6 w-6 text-status-warning-text" />
              </div>
              <p className="font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Pending Orders</p>
              <p className="font-display text-5xl font-black mt-2 text-foreground">{pendingCount}</p>
            </CardContent>
          </Card>
          <Card className="surface-card border-none shadow-xl rounded-[2.5rem] p-2">
            <CardContent className="p-6 bg-surface-2 surface-inset rounded-[2rem] h-full flex flex-col justify-center">
              <div className="w-14 h-14 bg-card rounded-[1rem] flex items-center justify-center mb-6 shadow-sm border border-border">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
              <p className="font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Today Volume</p>
              <p className="font-display text-5xl font-black mt-2 text-foreground">₹{todayVolume.toLocaleString("en-IN")}</p>
            </CardContent>
          </Card>
          <Card className="surface-card border-none shadow-xl rounded-[2.5rem] p-2">
            <CardContent className="p-6 bg-surface-2 surface-inset rounded-[2rem] h-full flex flex-col justify-center">
              <div className="w-14 h-14 bg-card rounded-[1rem] flex items-center justify-center mb-6 shadow-sm border border-border">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <p className="font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Total Processed</p>
              <p className="font-display text-5xl font-black mt-2 text-foreground">₹{totalProcessed.toLocaleString("en-IN")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by UPI, order ID, wallet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-14 font-mono font-bold text-base h-16 bg-card border-border rounded-[1.5rem] text-foreground shadow-sm"
            />
          </div>
          <div className="flex gap-2 bg-surface-2 p-2 rounded-[1.5rem] surface-inset w-full sm:w-auto">
            {(["pending", "all", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap flex-1 sm:flex-none ${
                  filter === f ? "surface-card text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Orders table */}
        <Card className="surface-card border-none shadow-xl rounded-[3rem] p-4">
          <CardContent className="p-0 bg-surface-2 surface-inset rounded-[2.5rem] overflow-hidden">
            {loading ? (
              <div className="py-32 text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-32 text-center">
                <div className="w-20 h-20 bg-card rounded-[1rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground">No orders found</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-surface-1 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                      {/* Order info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-muted-foreground bg-card px-3 py-1.5 rounded-lg border border-border shadow-sm">{order.id}</span>
                          <Badge className={`text-[10px] font-mono font-bold uppercase border-none px-3 py-1.5 shadow-sm ${
                            order.status === "completed" ? "bg-status-success-bg text-accent" :
                            order.status === "escrowed" ? "bg-status-warning-bg text-status-warning-text" :
                            "bg-card text-muted-foreground border border-border"
                          }`}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xl">
                          <span className="flex items-center gap-2 font-display font-black text-foreground bg-card shadow-sm px-5 py-2.5 rounded-[1rem] border border-border">
                            <IndianRupee className="h-5 w-5 text-primary" />
                            {order.inrAmount.toLocaleString("en-IN")}
                          </span>
                          <span className="text-muted-foreground font-bold">→</span>
                          <span className="font-mono font-bold text-base text-foreground bg-card shadow-sm px-5 py-2.5 rounded-[1rem] border border-border">{order.upiId}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-muted-foreground font-mono bg-muted p-4 rounded-2xl border border-border shadow-sm">
                          <span className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            {order.creatorAddress.slice(0, 8)}...{order.creatorAddress.slice(-6)}
                          </span>
                          <span className="text-primary">{order.cryptoAmount} {order.token}</span>
                          <span>{new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 shrink-0 mt-4 lg:mt-0">
                        {order.status === "escrowed" && (
                          <Button
                            onClick={() => processOrder(order.id, "complete")}
                            disabled={actionId === order.id}
                            className="btn-tactile-primary font-mono text-sm font-bold h-16 px-8 rounded-full"
                          >
                            {actionId === order.id ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                            MARK PAID
                          </Button>
                        )}
                        {(order.status === "open" || order.status === "escrowed") && (
                          <Button
                            variant="outline"
                            onClick={() => processOrder(order.id, "cancel")}
                            disabled={actionId === order.id}
                            className="font-mono text-sm font-bold text-destructive btn-tactile-secondary h-16 px-8 rounded-full"
                          >
                            <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                            CANCEL
                          </Button>
                        )}
                        {order.status === "completed" && (
                          <Badge className="bg-status-success-bg text-accent border-none shadow-none font-mono font-bold text-sm px-6 py-4 rounded-full">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            DONE
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
