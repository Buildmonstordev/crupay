"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PayUPIFlow } from "@/components/pay/pay-upi-flow";
import { useWallet } from "@solana/connector/react";
import {
  Receipt,
  Send,
  Clock,
  CheckCircle,
  IndianRupee,
} from "lucide-react";

interface Order {
  id: string;
  upiId: string;
  inrAmount: number;
  cryptoAmount: number;
  token: string;
  status: string;
  createdAt: number;
  description: string;
}

export default function DashboardPage() {
  const { isConnected, account } = useWallet();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    }
  }

  const stats = [
    {
      title: "Total Sent",
      value: `${orders.reduce((a, o) => a + o.cryptoAmount, 0).toFixed(2)} SOL`,
      icon: Send,
      color: "text-primary",
      bg: "surface-inset",
    },
    {
      title: "Pending",
      value: String(orders.filter((o) => o.status === "open" || o.status === "escrowed").length),
      icon: Clock,
      color: "text-[#E6A845]",
      bg: "surface-inset",
    },
    {
      title: "Completed",
      value: String(orders.filter((o) => o.status === "completed").length),
      icon: CheckCircle,
      color: "text-accent",
      bg: "surface-inset",
    },
    {
      title: "UPI Volume",
      value: `₹${orders.reduce((a, o) => a + o.inrAmount, 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-[#6E5C8C]",
      bg: "surface-inset",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <DashboardShell>
      <div className="space-y-10 max-w-[1200px] mx-auto pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        >
          <div>
            <h1 className="font-display text-5xl font-black tracking-tighter">Control Panel</h1>
            <p className="text-muted-foreground mt-2 font-medium text-lg">
              Send crypto, settle in INR instantly.
            </p>
          </div>
          {isConnected && (
            <div className="inline-flex items-center gap-3 surface-inset rounded-full px-5 py-2.5">
              <div className="h-3 w-3 bg-accent rounded-full shadow-[inset_0_2px_2px_rgba(255,255,255,0.5),_0_0_10px_rgba(45,90,76,0.5)] animate-pulse" />
              <p className="font-mono text-sm font-bold uppercase tracking-widest text-foreground">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            </div>
          )}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Main Payment Action */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="surface-card rounded-[2.5rem] p-0 overflow-hidden border-none h-full">
              <div className="bg-surface-1 flex flex-col h-full">
                <div className="border-b border-border/50 px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="border border-border shadow-sm p-3 rounded-[1rem] surface-card">
                      <IndianRupee className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="font-display text-3xl font-black tracking-tight">Pay UPI</h2>
                  </div>
                </div>
                <div className="p-8">
                  <PayUPIFlow onComplete={() => fetchOrders()} />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Stats & History */}
          <div className="lg:col-span-5 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                >
                  <div className="surface-card p-6 rounded-[2rem] hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</p>
                      <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="font-display text-3xl font-black tracking-tighter truncate text-foreground">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="rounded-[2rem] p-0 border-none shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] bg-surface-1 overflow-hidden">
                <div className="border-b border-border/50 px-6 py-5 flex items-center justify-between">
                  <h2 className="font-display font-bold text-xl tracking-tight">Recent Activity</h2>
                  <Badge variant="outline" className="font-mono bg-card shadow-sm border-none text-foreground">{orders.length}</Badge>
                </div>
                <div>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-12 px-6">
                      <div className="w-16 h-16 rounded-[1rem] surface-inset flex items-center justify-center mx-auto mb-4">
                        <Receipt className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-base font-bold">No activity yet</p>
                      <p className="text-sm text-muted-foreground font-medium mt-1">Initiate a payment to get started.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-5 hover:bg-surface-hover transition-colors"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="font-bold text-base truncate text-foreground">
                              ₹{order.inrAmount.toLocaleString("en-IN")} → <span className="text-muted-foreground font-medium">{order.upiId}</span>
                            </p>
                            <p className="font-mono text-sm font-bold text-primary mt-1">
                              {order.cryptoAmount} SOL
                            </p>
                          </div>
                          <Badge
                            className={`shrink-0 text-xs font-bold px-3 py-1.5 ${
                              order.status === "completed"
                                ? "bg-status-success-bg text-accent border-none shadow-none"
                                : order.status === "escrowed"
                                ? "bg-status-warning-bg text-status-warning-text border-none shadow-none"
                                : "bg-muted text-muted-foreground border-none shadow-none"
                            }`}
                          >
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
