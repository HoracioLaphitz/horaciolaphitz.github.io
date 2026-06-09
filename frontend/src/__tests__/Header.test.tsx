/**
 * Placeholder test — requires @testing-library/react + vitest to execute.
 * Written as TDD RED step before implementing Header changes.
 *
 * Spec: R2 (touch targets), R4 (sm: breakpoint), R6 (mobile menu backdrop + exit)
 *
 * Setup: once vitest + @testing-library/react is configured, unskip and run.
 */

// import { render, screen, fireEvent } from '@testing-library/react';
// import { Header } from '../presentation/components/layout/Header';

describe.skip('Header — responsive design', () => {
  it('shows inline nav links at viewport >= 640px (sm breakpoint)', () => {
    // R4: nav links should be visible at 640px, not just 768px
    // render(<Header />);
    // const navLinks = screen.getAllByRole('link', { name: /Proyectos|Experiencia|Certificaciones/ });
    // expect(navLinks.length).toBeGreaterThanOrEqual(3);
    // GIVEN sm:flex replaces hidden md:flex
    // THEN links are inline at 640px
    expect(true).toBe(true); // placeholder — real assertion requires render
  });

  it('renders backdrop overlay when mobile menu opens (R6)', () => {
    // R6: backdrop fixed inset-0 bg-black/20 z-40 on menu open
    // render(<Header />);
    // const hamburger = screen.getByLabelText('Abrir menú');
    // fireEvent.click(hamburger);
    // const backdrop = document.querySelector('.fixed.inset-0');
    // expect(backdrop).toBeInTheDocument();
    expect(true).toBe(true); // placeholder — real assertion requires render
  });

  it('tapping backdrop closes mobile menu (R6)', () => {
    // R6: tap-to-close via backdrop onClick
    // render(<Header />);
    // const hamburger = screen.getByLabelText('Abrir menú');
    // fireEvent.click(hamburger);
    // const backdrop = document.querySelector('.fixed.inset-0');
    // fireEvent.click(backdrop);
    // const nav = screen.queryByText('Proyectos');
    // Mobile menu should be hidden after backdrop click
    expect(true).toBe(true); // placeholder — real assertion requires render
  });

  it('plays exit animation on mobile menu close (R6)', () => {
    // R6: exit animation (fadeOutUp) plays before DOM removal
    // render(<Header />);
    // fireEvent.click(screen.getByLabelText('Abrir menú'));
    // fireEvent.click(screen.getByLabelText('Cerrar menú'));
    // const menu = document.querySelector('.md\\:hidden');
    // expect(menu?.className).toContain('animate-fade-out-up');
    expect(true).toBe(true); // placeholder — real assertion requires render
  });

  it('nav link touch targets >= 44px on mobile (R3)', () => {
    // R3: px-4 py-2 translates to min 44x44px bounding box
    // render(<Header />);
    // const links = screen.getAllByRole('link');
    // links.forEach(link => {
    //   const rect = link.getBoundingClientRect();
    //   expect(rect.width).toBeGreaterThanOrEqual(44);
    //   expect(rect.height).toBeGreaterThanOrEqual(44);
    // });
    expect(true).toBe(true); // placeholder — real assertion requires dom measurements
  });
});
