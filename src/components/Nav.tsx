import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export const Nav = () => (
  <header className="fixed top-0 left-0 right-0 z-50">
    <div className="container-narrow flex items-center justify-between py-6">
      <Link to="/" className="group flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent shadow-[0_0_24px_hsl(var(--primary)/0.5)]" />
        <span className="text-lg font-semibold tracking-tight">BrandLift</span>
      </Link>

      <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        <a href="#packages" className="transition-colors hover:text-foreground">Packages</a>
        <a href="#work" className="transition-colors hover:text-foreground">Approach</a>
        <a href="#contact" className="transition-colors hover:text-foreground">Contact</a>
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <a
          href="#packages"
          className="glass rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:scale-105"
        >
          Get started
        </a>
      </div>
    </div>
  </header>
);
