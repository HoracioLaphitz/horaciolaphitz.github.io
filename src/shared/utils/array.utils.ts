/**
 * Shared Utilities: Array Operations
 * Pure functions for array manipulation
 */

export class ArrayUtils {
  static unique<T>(array: T[]): T[] {
    return Array.from(new Set(array));
  }

  static isEmpty<T>(array: T[] | null | undefined): boolean {
    return !array || array.length === 0;
  }

  static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  static sortBy<T>(array: T[], key: keyof T, order: "asc" | "desc" = "asc"): T[] {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  }
}
