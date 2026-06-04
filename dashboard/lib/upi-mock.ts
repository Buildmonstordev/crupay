export function convertInrToSol(inrAmount: number, solPrice = 150): number {
  return inrAmount / solPrice;
}

export function convertInrToUsdc(inrAmount: number, usdcPrice = 83): number {
  return inrAmount / usdcPrice;
}

export function convertSolToInr(solAmount: number, solPrice = 150): number {
  return solAmount * solPrice;
}

export function convertUsdcToInr(usdcAmount: number, usdcPrice = 83): number {
  return usdcAmount * usdcPrice;
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatSol(amount: number): string {
  return `${amount.toFixed(4)} SOL`;
}

export function formatUsdc(amount: number): string {
  return `$${amount.toFixed(2)} USDC`;
}

export function generateUPIUrl(upiId: string, amount: number, note?: string): string {
  const params = new URLSearchParams();
  params.append("pa", upiId);
  params.append("pn", "CruPay Merchant");
  params.append("am", amount.toFixed(2));
  params.append("cu", "INR");
  if (note) params.append("tn", note);
  return `upi://pay?${params.toString()}`;
}
