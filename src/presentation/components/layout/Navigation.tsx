import { useState } from "react";
import Logo from "../ui/Logo";
import ThemeToggle from "../ui/ThemeToggle";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Inicio", path: "#inicio" },
    { name: "Proyectos", path: "#proyectos" },
    { name: "Servicios", path: "#services" },
    { name: "Experiencia", path: "#timeline" },
    { name: "Contacto", path: "#contacto" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    if (path.startsWith("#")) {
      e.preventDefault();

      // Si estamos en la página principal, hacer scroll
      if (window.location.pathname === "/") {
        const element = document.querySelector(path);
        if (element) {
          const offset = 56; // navbar height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      } else {
        // Si estamos en otra página, navegar a la página principal con el hash
        window.location.href = `/${path}`;
      }
      setIsMenuOpen(false);
    } else if (!path.startsWith("http")) {
      // Para rutas internas como /proyectos, dejar que navegue normalmente
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-skin-primary/95 backdrop-blur-xl border-b border-skin-border">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 text-skin-text hover:opacity-70 transition-opacity duration-200"
          >
            <Logo size="sm" />
          </a>

          {/* Desktop Navigation */}
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

            {/* Theme Toggle */}
            <div className="ml-3 pl-3 border-l border-skin-border">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-skin-muted hover:text-skin-text transition-colors duration-200 rounded-lg"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
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
