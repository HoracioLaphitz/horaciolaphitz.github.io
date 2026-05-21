export class Technology {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly iconUrl: string | null,
    public readonly category: string | null,
    public readonly createdAt: Date,
    public readonly projectCount: number = 0
  ) {}

  hasProjects(): boolean {
    return this.projectCount > 0;
  }
}
