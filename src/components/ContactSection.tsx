import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    package_interest: "Silver",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email and message.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("inquiries").insert(form);
    setLoading(false);
    if (error) {
      toast.error("Couldn't send. Try again in a moment.");
      return;
    }
    toast.success("Got it. We'll be in touch within 24 hours.");
    setForm({ name: "", email: "", phone: "", message: "", package_interest: "Silver" });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section id="contact" className="relative flex min-h-screen items-center py-32 md:py-48">
      <div className="container-narrow grid w-full grid-cols-1 items-center gap-16 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-accent">Contact</p>
          <h2 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tighter md:text-7xl">
            <span className="text-gradient">Let's build the next iconic brand.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg font-light text-muted-foreground">
            Tell us about your vision. We'll respond within 24 hours with a strategy outline and next steps.
          </p>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="rounded-[40px] glass-strong p-8 md:p-10"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={set("name")}
              className="h-12 rounded-2xl border border-border bg-input px-4 text-sm outline-none transition focus:border-primary"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={set("email")}
              className="h-12 rounded-2xl border border-border bg-input px-4 text-sm outline-none transition focus:border-primary"
            />
            <input
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={set("phone")}
              className="h-12 rounded-2xl border border-border bg-input px-4 text-sm outline-none transition focus:border-primary"
            />
            <select
              value={form.package_interest}
              onChange={set("package_interest")}
              className="h-12 rounded-2xl border border-border bg-input px-4 text-sm outline-none transition focus:border-primary"
            >
              <option>Bronze</option>
              <option>Silver</option>
              <option>Custom</option>
              <option>Not sure yet</option>
            </select>
          </div>
          <textarea
            required
            placeholder="Tell us about your brand…"
            rows={5}
            value={form.message}
            onChange={set("message")}
            className="mt-4 w-full resize-none rounded-2xl border border-border bg-input p-4 text-sm outline-none transition focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="liquid-border mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? "Sending…" : "Send inquiry"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};
