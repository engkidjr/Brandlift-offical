import { useState } from "react";
import { motion } from "framer-motion";
import { usePaystackPayment } from "react-paystack";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PAYSTACK_PUBLIC_KEY, isPaystackConfigured } from "@/config/paystack";

type Pkg = {
  id: "bronze" | "silver" | "custom";
  name: string;
  priceLabel: string;
  // Use the upper bound for the actual charge — adjust as needed.
  amountGhs: number;
  summary: string;
  features: string[];
  recommended?: boolean;
};

const PACKAGES: Pkg[] = [
  {
    id: "bronze",
    name: "Bronze",
    priceLabel: "GH₵ 250 – 350",
    amountGhs: 350,
    summary: "Kickstart your digital presence.",
    features: [
      "Design & Print Flyers",
      "Promotional Videos",
      "1 – 2 Videos / Week",
      "TikTok Only",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    priceLabel: "GH₵ 500 – 700",
    amountGhs: 700,
    summary: "Scale your reach across social platforms.",
    features: [
      "Everything in Bronze",
      "3 – 4 Videos / Week",
      "TikTok, Instagram & Snapchat",
      "Priority turnaround",
    ],
    recommended: true,
  },
  {
    id: "custom",
    name: "Custom",
    priceLabel: "GH₵ 800 – 1000",
    amountGhs: 1000,
    summary: "Total brand domination.",
    features: [
      "Most Flexible Package",
      "4 – 5 Videos / Week",
      "All Social Platforms",
      "Dedicated brand strategist",
    ],
  },
];

export const PricingSection = () => {
  const [selected, setSelected] = useState<Pkg["id"]>("silver");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const active = PACKAGES.find((p) => p.id === selected)!;

  const initialize = usePaystackPayment({
    reference: `bl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: email || "guest@brandlift.app",
    amount: active.amountGhs * 100, // pesewas
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: "GHS",
  });

  const handlePay = async () => {
    if (!email || !name) {
      toast.error("Please enter your name and email first.");
      return;
    }
    if (!isPaystackConfigured()) {
      toast.error("Paystack key not configured. Add your pk_test_… key in src/config/paystack.ts");
      return;
    }

    setLoading(true);
    initialize({
      onSuccess: async (ref: { reference: string }) => {
        try {
          await supabase.from("transactions").insert({
            reference: ref.reference,
            amount: active.amountGhs * 100,
            currency: "GHS",
            status: "success",
            customer_email: email,
            customer_name: name,
            package_name: active.name,
          });
          toast.success(`Payment successful! Reference: ${ref.reference}`);
        } catch {
          toast.success("Payment successful, but we couldn't record it locally.");
        } finally {
          setLoading(false);
        }
      },
      onClose: () => {
        setLoading(false);
        toast.info("Payment window closed.");
      },
    });
  };

  return (
    <section id="packages" className="relative flex min-h-screen items-center py-32 md:py-48">
      <div className="container-narrow w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-accent">
            Growth Packages
          </p>
          <h2 className="text-balance text-5xl font-extrabold tracking-tighter md:text-7xl">
            <span className="text-gradient">Pick your altitude.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg font-light text-muted-foreground">
            Three tiers, one outcome — a brand that ships content like a studio.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {PACKAGES.map((pkg, i) => {
            const isActive = selected === pkg.id;
            return (
              <motion.button
                key={pkg.id}
                type="button"
                onClick={() => setSelected(pkg.id)}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={[
                  "group relative flex flex-col items-start rounded-[40px] p-8 text-left transition-all duration-500 md:p-10",
                  "glass hover:bg-white/[0.05]",
                  isActive
                    ? "liquid-border scale-[1.04] shadow-[0_30px_120px_-20px_hsl(var(--primary)/0.4)]"
                    : "scale-100",
                ].join(" ")}
              >
                {pkg.recommended && !isActive && (
                  <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Most popular
                  </span>
                )}

                <div className="mb-6 flex w-full items-center justify-between">
                  <h3 className="text-3xl font-bold tracking-tight">{pkg.name}</h3>
                  <div
                    className={[
                      "h-5 w-5 rounded-full border-2 transition-all",
                      isActive
                        ? "border-accent bg-accent shadow-[0_0_16px_hsl(var(--accent)/0.7)]"
                        : "border-muted-foreground/40",
                    ].join(" ")}
                  />
                </div>

                <p className="mb-2 text-3xl font-extrabold tracking-tight text-gradient-brand md:text-4xl">
                  {pkg.priceLabel}
                </p>
                <p className="mb-8 text-base font-light text-muted-foreground">
                  {pkg.summary}
                </p>

                <ul className="space-y-4 text-lg">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                      </span>
                      <span className="leading-snug text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>

        {/* Checkout panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-16 max-w-3xl rounded-[40px] glass-strong p-8 md:p-10"
        >
          <div className="mb-6 flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Selected
              </p>
              <p className="text-2xl font-bold">{active.name} · {active.priceLabel}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              You'll be charged <span className="font-semibold text-foreground">GH₵ {active.amountGhs}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-2xl border border-border bg-input px-4 text-sm outline-none transition focus:border-primary"
            />
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-2xl border border-border bg-input px-4 text-sm outline-none transition focus:border-primary"
            />
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={loading}
            className="liquid-border mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {loading ? "Opening Paystack…" : `Pay GH₵ ${active.amountGhs} with Paystack`}
          </button>

          {!isPaystackConfigured() && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              ⚠ Add your Paystack public key in <code className="rounded bg-muted px-1.5 py-0.5">src/config/paystack.ts</code> to enable real payments.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
