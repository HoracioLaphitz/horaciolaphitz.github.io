export type Theme = 'light' | 'dark';

export const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored) return stored;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const setTheme = (theme: Theme): void => {
  localStorage.setItem('theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

export const toggleTheme = (): Theme => {
  const current = getInitialTheme();
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
  return next;
};
