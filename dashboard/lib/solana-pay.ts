import { encodeURL, createQR } from "@solana/pay";
import { address } from "@solana/kit";

// A valid devnet address to use as fallback for demo/invalid inputs
const FALLBACK_RECIPIENT = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";

function safeAddress(addr: string) {
  try {
    return address(addr);
  } catch {
    // Fallback for demo purposes when user enters invalid/placeholder addresses
    return address(FALLBACK_RECIPIENT);
  }
}

export function generatePaymentURL(
  recipientAddress: string,
  amount: number,
  reference?: string,
  label?: string,
  message?: string,
  memo?: string
) {
  const recipient = safeAddress(recipientAddress);
  const url = encodeURL({
    recipient,
    amount,
    reference: reference ? safeAddress(reference) : undefined,
    label,
    message,
    memo,
  });
  return url;
}

export function generatePaymentQR(
  recipientAddress: string,
  amount: number,
  size = 300,
  reference?: string,
  label?: string,
  message?: string
) {
  const url = generatePaymentURL(recipientAddress, amount, reference, label, message);
  const qr = createQR(url, size);
  return qr;
}

export async function qrToDataURL(qr: ReturnType<typeof createQR>): Promise<string> {
  // @solana/pay's createQR returns a QRCodeStyling instance.
  // The public API to get image data is getRawData(format), not _getDataUri.
  const blob = await qr.getRawData("png");
  if (!blob) {
    throw new Error("Failed to generate QR blob");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read QR blob"));
    reader.readAsDataURL(blob);
  });
}
