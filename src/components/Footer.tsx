export const Footer = () => (
  <footer className="relative border-t border-border/40 py-12">
    <div className="container-narrow flex flex-col items-center justify-between gap-6 text-sm text-muted-foreground md:flex-row">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-primary to-accent" />
        <span className="font-medium text-foreground">BrandLift</span>
        <span>· Accra, Ghana</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="#packages" className="transition-colors hover:text-foreground">Packages</a>
        <a href="#contact" className="transition-colors hover:text-foreground">Contact</a>
        <a href="/brand-admin" className="transition-colors hover:text-foreground">Admin</a>
      </div>
      <p>© {new Date().getFullYear()} BrandLift. All rights reserved.</p>
    </div>
  </footer>
);
