/**
 * Value Object: SearchQuery
 * Encapsulates search query validation and normalization
 */

export class SearchQuery {
  private readonly value: string;

  private constructor(query: string) {
    this.value = this.normalize(query);
  }

  static create(query: string): SearchQuery {
    return new SearchQuery(query);
  }

  static empty(): SearchQuery {
    return new SearchQuery("");
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  getValue(): string {
    return this.value;
  }

  private normalize(query: string): string {
    if (!query || typeof query !== "string") return "";
    return query.trim().toLowerCase();
  }

  equals(other: SearchQuery): boolean {
    return this.value === other.value;
  }
}
