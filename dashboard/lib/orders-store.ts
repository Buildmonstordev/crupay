export interface Order {
  id: string;
  creatorAddress: string;
  upiId: string;
  inrAmount: number;
  cryptoAmount: number;
  token: "SOL" | "USDC";
  description: string;
  status: "open" | "escrowed" | "paid" | "confirmed" | "completed" | "disputed" | "cancelled";
  takerAddress?: string;
  escrowTx?: string;
  releaseTx?: string;
  createdAt: number;
  paidAt?: number;
  confirmedAt?: number;
}

export const orders: Order[] = [
  {
    id: "ord_001",
    creatorAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    upiId: "freelancer@upi",
    inrAmount: 2500,
    cryptoAmount: 16.67,
    token: "USDC",
    description: "Logo design payment",
    status: "open",
    createdAt: Date.now() - 3600000,
  },
  {
    id: "ord_002",
    creatorAddress: "8dKXTg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgBsV",
    upiId: "merchant@okaxis",
    inrAmount: 500,
    cryptoAmount: 3.33,
    token: "USDC",
    description: "Coffee shop bill",
    status: "escrowed",
    escrowTx: "5Uf...",
    createdAt: Date.now() - 7200000,
  },
  {
    id: "ord_003",
    creatorAddress: "9eLYtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgCtW",
    upiId: "developer@paytm",
    inrAmount: 12000,
    cryptoAmount: 80,
    token: "USDC",
    description: "Web dev milestone",
    status: "paid",
    takerAddress: "Abcd...",
    paidAt: Date.now() - 1800000,
    createdAt: Date.now() - 10800000,
  },
];

export function createOrder(data: Omit<Order, "id" | "status" | "createdAt">): Order {
  const order: Order = {
    ...data,
    id: `ord_${Date.now().toString(36)}`,
    status: "open",
    createdAt: Date.now(),
  };
  orders.unshift(order);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function updateOrder(id: string, updates: Partial<Order>): Order | undefined {
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  orders[idx] = { ...orders[idx], ...updates };
  return orders[idx];
}

export function getOpenOrders(): Order[] {
  return orders.filter((o) => o.status === "open" || o.status === "escrowed");
}

export function getUserOrders(address: string): Order[] {
  return orders.filter((o) => o.creatorAddress === address || o.takerAddress === address);
}
