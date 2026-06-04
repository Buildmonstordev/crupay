import { NextRequest, NextResponse } from "next/server";
import { orders, createOrder, getOrder, updateOrder, getOpenOrders } from "@/lib/orders-store";
import { airdropEscrowIfNeeded } from "@/lib/escrow";

export async function GET() {
  await airdropEscrowIfNeeded();
  return NextResponse.json({ orders: getOpenOrders() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = createOrder({
      creatorAddress: body.creatorAddress,
      upiId: body.upiId,
      inrAmount: body.inrAmount,
      cryptoAmount: body.cryptoAmount,
      token: body.token,
      description: body.description || "",
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
