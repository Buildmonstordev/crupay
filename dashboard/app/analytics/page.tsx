"use client";

import { motion } from "motion/react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvilAreaChart } from "@/components/charts/area-chart";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, ShieldCheck, Activity, ArrowRight } from "lucide-react";
import { toast } from "sonner";

// Simulated +40% MoM growth curve ending at ~1,300 cumulative pre-registrations
const growthData = [
  { month: "Nov", users: 340 },
  { month: "Dec", users: 475 },
  { month: "Jan", users: 665 },
  { month: "Feb", users: 930 },
  { month: "Mar", users: 1305 },
];

export default function AnalyticsPage() {
  const stats = [
    {
      title: "Total Pre-Registrations",
      value: "1,300+",
      icon: Users,
      color: "text-primary",
      bg: "surface-inset",
    },
    {
      title: "MoM Growth",
      value: "+40%",
      icon: TrendingUp,
      color: "text-[#E6A845]",
      bg: "surface-inset",
    },
    {
      title: "KYC Verified Profiles",
      value: "250+",
      icon: ShieldCheck,
      color: "text-accent",
      bg: "surface-inset",
    },
    {
      title: "Daily Active Interest",
      value: "High",
      icon: Activity,
      color: "text-[#6E5C8C]",
      bg: "surface-inset",
    },
  ];

  const handlePreRegister = () => {
    toast.success("You are on the waitlist! You are KYC-verified user #251.");
  };

  return (
    <DashboardShell>
      <div className="space-y-10 max-w-[1200px] mx-auto pb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        >
          <div>
            <h1 className="font-display text-5xl font-black tracking-tighter">Traction & Analytics</h1>
            <p className="text-muted-foreground mt-2 font-medium text-lg">
              CruPay is currently in stealth, but the demand is overwhelming.
            </p>
          </div>
          <Button onClick={handlePreRegister} className="h-14 px-8 rounded-full btn-tactile-primary text-base font-bold shadow-sm">
            Pre-register Interest <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
            >
              <div className="surface-card p-6 rounded-[2rem] hover:-translate-y-1 transition-transform duration-300 h-full">
                <div className="flex items-center justify-between mb-6">
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</p>
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="font-display text-4xl font-black tracking-tighter truncate text-foreground">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="surface-card rounded-[2.5rem] p-0 overflow-hidden border-none shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]">
            <div className="bg-surface-1 flex flex-col h-full">
              <CardHeader className="border-b border-border/50 px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="bg-card border border-border shadow-sm p-3 rounded-[1rem] surface-card">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-3xl font-black tracking-tight">Waitlist Growth</CardTitle>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Cumulative pre-registered users across India.</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 bg-surface-1">
                <div className="h-[400px] w-full">
                  <EvilAreaChart
                    data={growthData}
                    xKey="month"
                    yKeys={["users"]}
                    colors={["#FF5A36"]}
                  />
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
