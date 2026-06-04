export interface ParsedUpiQR {
  upiId: string;
  name?: string;
  amount?: number;
  note?: string;
  raw: string;
}

/**
 * Parse a UPI QR code string.
 * UPI QR codes contain data like:
 *   upi://pay?pa=merchant@upi&pn=Merchant%20Name&am=500&cu=INR&tn=Payment%20for%20order
 * 
 * Some QR codes may not have the upi:// prefix but still contain pa= parameter.
 * Some may just be a plain UPI ID like "name@upi".
 */
export function parseUpiQR(text: string): ParsedUpiQR | null {
  const raw = text.trim();

  // Try parsing as a upi:// URL
  if (raw.toLowerCase().startsWith("upi://")) {
    try {
      // Replace upi:// with https:// for URL parsing
      const url = new URL(raw.replace(/^upi:\/\//i, "https://"));
      const pa = url.searchParams.get("pa");
      if (pa) {
        return {
          upiId: pa,
          name: url.searchParams.get("pn") || undefined,
          amount: url.searchParams.get("am") ? parseFloat(url.searchParams.get("am")!) : undefined,
          note: url.searchParams.get("tn") || undefined,
          raw,
        };
      }
    } catch {}
  }

  // Try parsing as a query string with pa= parameter
  if (raw.includes("pa=")) {
    const match = raw.match(/pa=([^&\s]+)/);
    const amMatch = raw.match(/am=([^&\s]+)/);
    const pnMatch = raw.match(/pn=([^&\s]+)/);
    const tnMatch = raw.match(/tn=([^&\s]+)/);
    if (match) {
      return {
        upiId: decodeURIComponent(match[1]),
        name: pnMatch ? decodeURIComponent(pnMatch[1]) : undefined,
        amount: amMatch ? parseFloat(amMatch[1]) : undefined,
        note: tnMatch ? decodeURIComponent(tnMatch[1]) : undefined,
        raw,
      };
    }
  }

  // Check if it looks like a plain UPI ID (contains @)
  if (raw.includes("@") && !raw.includes(" ") && raw.length < 100) {
    return {
      upiId: raw,
      raw,
    };
  }

  return null;
}

export function isUpiQR(text: string): boolean {
  return parseUpiQR(text) !== null;
}
