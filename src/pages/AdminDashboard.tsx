import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, TrendingUp, Users, CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AmbientOrbs } from "@/components/AmbientOrbs";
import { toast } from "sonner";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  package_interest: string | null;
  created_at: string;
};

type Transaction = {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  customer_email: string;
  customer_name: string | null;
  package_name: string;
  created_at: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/brand-admin", { replace: true });
    });

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/brand-admin", { replace: true });
        return;
      }

      // Verify admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const admin = (roles ?? []).some((r) => r.role === "admin");
      setIsAdmin(admin);

      if (!admin) {
        toast.error("This account is not an admin.");
        setLoading(false);
        return;
      }

      const [{ data: inq }, { data: tx }] = await Promise.all([
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("transactions").select("*").order("created_at", { ascending: false }),
      ]);
      setInquiries((inq as Inquiry[]) ?? []);
      setTransactions((tx as Transaction[]) ?? []);
      setLoading(false);
    })();

    return () => {
      sub.data.subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/brand-admin", { replace: true });
  };

  const totalRevenue = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0) / 100;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <AmbientOrbs />
        <div className="max-w-md rounded-3xl glass-strong p-10 text-center">
          <h1 className="text-2xl font-bold">Access denied</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account doesn't have admin privileges.
          </p>
          <button
            onClick={signOut}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientOrbs />

      <header className="border-b border-border/40">
        <div className="container-narrow flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent" />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Control Center</p>
              <h1 className="text-lg font-semibold tracking-tight">BrandLift Admin</h1>
            </div>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm transition-transform hover:scale-105"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="container-narrow py-16 md:py-24">
        {/* Stats */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard icon={TrendingUp} label="Total revenue" value={`GH₵ ${totalRevenue.toFixed(2)}`} />
          <StatCard icon={CreditCard} label="Successful payments" value={String(transactions.filter((t) => t.status === "success").length)} />
          <StatCard icon={Users} label="Inquiries" value={String(inquiries.length)} />
        </section>

        {/* Transactions */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Recent transactions</h2>
          <div className="overflow-hidden rounded-3xl glass">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <Th>Reference</Th><Th>Customer</Th><Th>Package</Th><Th>Amount</Th><Th>Status</Th><Th>Date</Th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No transactions yet.</td></tr>
                  )}
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/20 last:border-0">
                      <Td><span className="font-mono text-xs">{t.reference}</span></Td>
                      <Td><div className="font-medium">{t.customer_name ?? "—"}</div><div className="text-xs text-muted-foreground">{t.customer_email}</div></Td>
                      <Td>{t.package_name}</Td>
                      <Td>GH₵ {(t.amount / 100).toFixed(2)}</Td>
                      <Td>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${t.status === "success" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                          {t.status}
                        </span>
                      </Td>
                      <Td className="text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Inquiries */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Client inquiries</h2>
          <div className="overflow-hidden rounded-3xl glass">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Interest</Th><Th>Message</Th><Th>Date</Th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No inquiries yet.</td></tr>
                  )}
                  {inquiries.map((i) => (
                    <tr key={i.id} className="border-b border-border/20 last:border-0 align-top">
                      <Td className="font-medium">{i.name}</Td>
                      <Td>{i.email}</Td>
                      <Td>{i.phone ?? "—"}</Td>
                      <Td>{i.package_interest ?? "—"}</Td>
                      <Td className="max-w-md whitespace-pre-wrap text-muted-foreground">{i.message}</Td>
                      <Td className="text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: typeof TrendingUp; label: string; value: string }) => (
  <div className="rounded-3xl glass p-8">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
      <Icon className="h-5 w-5 text-accent" />
    </div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
  </div>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-6 py-4 font-medium">{children}</th>
);
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-6 py-4 ${className}`}>{children}</td>
);

export default AdminDashboard;
