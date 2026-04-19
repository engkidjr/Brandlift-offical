import { motion } from "framer-motion";
import { Camera, Sparkles, Rocket } from "lucide-react";

const PILLARS = [
  {
    icon: Camera,
    title: "Cinematic capture",
    body: "We shoot product, brand and lifestyle content that looks like it belongs on a billboard — not a feed.",
  },
  {
    icon: Sparkles,
    title: "Story-first design",
    body: "Every flyer, reel and post is engineered to land an emotion in the first three seconds.",
  },
  {
    icon: Rocket,
    title: "Compounding growth",
    body: "We ship weekly, measure ruthlessly, and double down on what makes your brand impossible to ignore.",
  },
];

export const ApproachSection = () => (
  <section id="work" className="relative flex min-h-screen items-center py-32 md:py-48">
    <div className="container-narrow w-full">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mb-20 max-w-3xl"
      >
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-accent">Approach</p>
        <h2 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tighter md:text-7xl">
          <span className="text-gradient">A studio loop, not a service desk.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="group rounded-[40px] glass p-10 transition-colors hover:bg-white/[0.05]"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
              <p.icon className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-3 text-2xl font-bold tracking-tight">{p.title}</h3>
            <p className="text-base font-light leading-relaxed text-muted-foreground">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
