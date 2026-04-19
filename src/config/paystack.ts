// BrandLift — Paystack configuration
// Replace the placeholder with your real Paystack PUBLIC key (pk_test_... or pk_live_...).
// Public keys are safe to ship in the browser bundle.
//
// Get your key at: https://dashboard.paystack.com/#/settings/developers

export const PAYSTACK_PUBLIC_KEY =
  (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined) ??
  "pk_test_0818cc43d708f6bd60d4f20ff6479431d3865f6f";

export const isPaystackConfigured = () =>
  PAYSTACK_PUBLIC_KEY.startsWith("pk_") && !PAYSTACK_PUBLIC_KEY.includes("REPLACE_ME");
