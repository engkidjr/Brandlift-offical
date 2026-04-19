import { useEffect, useRef } from "react";

/**
 * Cinematic ambient background — slow-floating liquid orbs that subtly track the cursor.
 * Pure CSS-driven motion, GPU friendly.
 */
export const AmbientOrbs = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 40;
      ty = (e.clientY / window.innerHeight - 0.5) * 40;
    };
    const tick = () => {
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      el.style.setProperty("--mx", `${cx}px`);
      el.style.setProperty("--my", `${cy}px`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ['--mx' as never]: '0px', ['--my' as never]: '0px' }}
    >
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_85%)]" />

      {/* Cobalt orb */}
      <div
        className="absolute h-[55vw] w-[55vw] rounded-full blur-3xl opacity-70 animate-float-slow"
        style={{
          top: '-15vw',
          left: '-10vw',
          background: 'var(--gradient-radial-orb)',
          transform: 'translate3d(calc(var(--mx) * 1.2), calc(var(--my) * 1.2), 0)',
        }}
      />

      {/* Mint orb */}
      <div
        className="absolute h-[45vw] w-[45vw] rounded-full blur-3xl opacity-60 animate-float-slow"
        style={{
          bottom: '-10vw',
          right: '-10vw',
          background: 'var(--gradient-radial-mint)',
          animationDelay: '-7s',
          transform: 'translate3d(calc(var(--mx) * -1), calc(var(--my) * -1), 0)',
        }}
      />

      {/* Center accent */}
      <div
        className="absolute left-1/2 top-1/2 h-[30vw] w-[30vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30 animate-float-slow"
        style={{
          background: 'var(--gradient-radial-orb)',
          animationDelay: '-3s',
          transform: 'translate3d(calc(-50% + var(--mx) * 0.6), calc(-50% + var(--my) * 0.6), 0)',
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
    </div>
  );
};
