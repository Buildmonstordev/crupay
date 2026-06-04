import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders-store";
import { releaseEscrowSol } from "@/lib/escrow";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const order = getOrder(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updates: Partial<typeof order> = {};

  if (body.action === "take" && order.status === "escrowed") {
    updates.takerAddress = body.takerAddress;
    updates.status = "paid";
    updates.paidAt = Date.now();
  }

  if (body.action === "confirm" && order.status === "paid") {
    updates.status = "confirmed";
    updates.confirmedAt = Date.now();
  }

  if (body.action === "complete" && order.status === "confirmed") {
    try {
      if (order.token === "SOL") {
        const tx = await releaseEscrowSol(order.takerAddress!, order.cryptoAmount);
        updates.releaseTx = tx;
      }
      updates.status = "completed";
    } catch (err) {
      return NextResponse.json({ error: "Escrow release failed", detail: String(err) }, { status: 500 });
    }
  }

  if (body.action === "cancel" && (order.status === "open" || order.status === "escrowed")) {
    updates.status = "cancelled";
  }

  if (body.action === "escrow" && order.status === "open") {
    updates.status = "escrowed";
    updates.escrowTx = body.escrowTx;
  }

  const updated = updateOrder(id, updates);
  return NextResponse.json({ order: updated });
}
