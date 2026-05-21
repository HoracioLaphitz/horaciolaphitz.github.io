export class Experience {
  constructor(
    public readonly id: string,
    public readonly company: string,
    public readonly role: string,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly description: string | null,
    public readonly achievements: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  isCurrent(): boolean {
    return this.endDate === null;
  }

  getDuration(): string {
    const start = this.startDate;
    const end = this.endDate || new Date();

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
    }

    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'año' : 'años'}`;
    }

    return `${years} ${years === 1 ? 'año' : 'años'} ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
  }
}
