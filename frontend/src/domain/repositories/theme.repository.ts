/**
 * Theme Repository Interface
 * Domain layer - Defines the contract for theme persistence
 * Following Dependency Inversion Principle (DIP)
 */

import type { Theme } from '../entities/theme.entity';

export interface IThemeRepository {
  /**
   * Gets the stored theme preference
   * @returns The stored theme or null if not set
   */
  getTheme(): Theme | null;

  /**
   * Stores the theme preference
   * @param theme - The theme to store
   */
  setTheme(theme: Theme): void;

  /**
   * Removes the stored theme preference
   */
  clearTheme(): void;
}
