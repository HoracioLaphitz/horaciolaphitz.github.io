/**
 * Shared Utilities: String Operations
 * Pure functions without external dependencies
 */

export class StringUtils {
  static isEmpty(value: string | null | undefined): boolean {
    return !value || value.trim().length === 0;
  }

  static normalize(value: string): string {
    if (!value) return "";
    return value.trim().toLowerCase();
  }

  static truncate(value: string, maxLength: number): string {
    if (value.length <= maxLength) return value;
    return value.slice(0, maxLength) + "...";
  }

  static slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  static capitalize(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
