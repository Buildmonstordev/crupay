"use client";

import { useState } from "react";
import { useConnector, useWallet } from "@solana/connector/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wallet, LogOut, Copy, Check, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function WalletButton() {
  const { connectors, connectWallet, disconnectWallet, isConnecting } = useConnector();
  const { isConnected, account } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Address copied!");
    }
  };

  const handleConnect = async (connectorId: string) => {
    try {
      await connectWallet(connectorId as any);
      setModalOpen(false);
      toast.success("Wallet connected!");
    } catch {
      toast.error("Failed to connect wallet");
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setModalOpen(false);
    toast.success("Wallet disconnected");
  };

  if (isConnected && account) {
    const shortAddress = `${account.slice(0, 4)}...${account.slice(-4)}`;
    return (
      <>
        <Button
          variant="outline"
          className="gap-2 btn-tactile-secondary hover:bg-surface-hover"
          onClick={() => setModalOpen(true)}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Avatar className="h-5 w-5">
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
              {account.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline font-mono text-xs">{shortAddress}</span>
        </Button>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="surface-card border-none shadow-2xl max-w-sm rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-center font-display text-lg text-foreground">CruPay Wallet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-14 w-14 ring-2 ring-primary/30">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {account.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center w-full mt-2">
                  <p className="font-mono text-[11px] sm:text-xs font-bold bg-muted px-3 py-2.5 rounded-xl truncate border border-border">{account}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-3">Connected to Devnet</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button variant="outline" onClick={handleCopy} className="btn-tactile-secondary rounded-full h-12 font-bold text-xs uppercase w-full">
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="outline" onClick={() => setModalOpen(false)} className="btn-tactile-secondary rounded-full h-12 font-bold text-xs uppercase w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                className="w-full h-12 rounded-full font-bold uppercase tracking-widest"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect Wallet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        disabled={isConnecting}
        className="gap-2 bg-primary hover:bg-primary/90"
      >
        <Wallet className="h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="surface-card border-none shadow-2xl max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-xl text-foreground">Connect Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-center text-sm text-muted-foreground">
              Select a wallet to connect to CruPay
            </p>
            <div className="grid gap-2">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  disabled={!connector.ready || isConnecting}
                  className="flex items-center gap-4 rounded-2xl surface-inset border border-border p-4 transition-all hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed text-left shadow-inner"
                >
                  {connector.icon ? (
                    <img src={connector.icon} alt={connector.name} className="h-8 w-8 rounded-lg" />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Wallet className="h-4 w-4" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{connector.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {connector.ready ? "Installed" : "Not installed"}
                    </p>
                  </div>
                  {connector.ready && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              New to Solana?{" "}
              <a
                href="https://phantom.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get Phantom Wallet
              </a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
