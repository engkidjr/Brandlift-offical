import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="container-narrow text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          A cinematic brand growth studio · Accra, Ghana
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-6xl font-extrabold leading-[0.95] tracking-tighter text-gradient sm:text-7xl md:text-8xl lg:text-9xl"
        >
          Brand<span className="text-gradient-brand">Lift</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-2xl text-balance text-lg font-light leading-relaxed text-muted-foreground md:text-xl"
        >
          We design, film and scale bold brands across TikTok, Instagram and Snapchat —
          turning attention into compounding growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#packages"
            className="liquid-border rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Choose your package
          </a>
          <a
            href="#contact"
            className="glass rounded-full px-8 py-4 text-base font-medium transition-transform hover:scale-105"
          >
            Talk to us
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute inset-x-0 bottom-10 flex justify-center"
        >
          <div className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/60">
            <span>Scroll</span>
            <div className="h-10 w-px bg-gradient-to-b from-muted-foreground/60 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
