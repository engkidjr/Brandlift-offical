import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AmbientOrbs } from "@/components/AmbientOrbs";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "verify">("email");
  const [isScaled, setIsScaled] = useState(false);

  // Already logged in? Bounce to dashboard.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/brand-admin/dashboard", { replace: true });
    });
  }, [navigate]);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin + "/brand-admin/dashboard"
        },
      });

      setLoading(false);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Verification code sent! Check your email.");
      setStep("verify");
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "An unexpected error occurred.");
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "email",
      });

      setLoading(false);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.session) {
        toast.success("Verified successfully!");
        navigate("/brand-admin/dashboard", { replace: true });
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      <AmbientOrbs />

      <div className="w-full max-w-md">
        {/* macOS-style window */}
        <div className={`overflow-hidden rounded-3xl glass-strong shadow-[0_30px_120px_-20px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-in-out ${isScaled ? 'scale-105' : ''}`}>
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
            <button 
              type="button" 
              onClick={() => navigate("/")} 
              className="h-3 w-3 rounded-full bg-[#ff5f57] hover:opacity-80 transition-opacity" 
              aria-label="Close" 
            />
            <button 
              type="button" 
              onClick={() => setIsScaled(!isScaled)} 
              className="h-3 w-3 rounded-full bg-[#febc2e] hover:opacity-80 transition-opacity" 
              aria-label="Scale up" 
            />
            <button 
              type="button" 
              onClick={() => navigate("/")} 
              className="h-3 w-3 rounded-full bg-[#28c840] hover:opacity-80 transition-opacity" 
              aria-label="Maximize" 
            />
            <span className="ml-3 text-xs text-muted-foreground">brand-admin · secure session</span>
          </div>

          <div className="p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_0_40px_hsl(var(--primary)/0.5)]">
                <KeyRound className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Admin System</h1>
              <p className="mt-2 text-sm text-muted-foreground px-4">
                {step === "email" 
                  ? "Enter your email to receive a secure login link and code." 
                  : "Click the magic link in your email or enter the 6-digit code below."}
              </p>
            </div>

            {step === "email" ? (
              <form onSubmit={sendOtp} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-border bg-input pl-11 pr-4 text-sm outline-none transition focus:border-primary"
                    placeholder="Admin email address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="liquid-border inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loading ? "Sending…" : "Send verification code"}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-border bg-input pl-11 pr-4 text-sm outline-none transition focus:border-primary tracking-widest font-mono font-medium text-center"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="liquid-border inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loading ? "Verifying…" : "Verify and Login"}
                </button>
                
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ← Back to email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
