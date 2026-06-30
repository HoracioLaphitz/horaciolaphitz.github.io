import { useState, useEffect } from "react";
import Logo from "../ui/Logo";
import ThemeToggle from "../ui/ThemeToggle";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Proyectos", path: "#proyectos" },
    { name: "Stack", path: "#skills" },
    { name: "Contacto", path: "#contacto" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith("#")) {
      e.preventDefault();
      if (window.location.pathname === "/") {
        const el = document.querySelector(path);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 56;
          window.scrollTo({ top, behavior: "smooth" });
        }
      } else {
        window.location.href = `/${path}`;
      }
      setIsMenuOpen(false);
    }
  };

  const navClass = scrolled
    ? "bg-skin-primary/95 backdrop-blur-xl border-b border-skin-border shadow-sm"
    : "bg-transparent border-b border-transparent";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}>
      <div className="mx-auto px-6 max-w-[980px]">
        <div className="flex items-center justify-between h-14">
          <a
            href="/"
            className="flex items-center gap-2 text-skin-text hover:opacity-70 transition-opacity duration-200"
          >
            <Logo size="sm" />
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                className="px-4 py-2 text-sm font-medium text-skin-muted hover:text-skin-text transition-colors duration-200 rounded-lg"
              >
                {item.name}
              </a>
            ))}
            <div className="ml-3 pl-3 border-l border-skin-border">
              <ThemeToggle />
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-skin-muted hover:text-skin-text transition-colors duration-200 rounded-lg"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-skin-border">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className="px-4 py-2.5 text-sm font-medium text-skin-muted hover:text-skin-text hover:bg-skin-secondary transition-all duration-200 rounded-lg"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
