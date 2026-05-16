# Portfolio - Horacio Laphitz

Professional portfolio built with Astro, React, and Tailwind CSS. Deployed on GitHub Pages with automated CI/CD.

## 🚀 Tech Stack

- **Framework**: Astro 5.x
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript 5
- **Testing**: Vitest
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Package Manager**: pnpm 9

## 📋 Prerequisites

- Node.js >= 23.0.0
- pnpm >= 9.0.0

### Installing Node.js 23

**Using nvm (recommended):**

```bash
# Install nvm if you haven't already
# Visit: https://github.com/nvm-sh/nvm

# Install Node.js 23
nvm install 23

# Use Node.js 23
nvm use 23
```

**Direct download:**

- Download from [nodejs.org](https://nodejs.org/)

## 🛠️ Installation

```bash
# Clone repository
git clone https://github.com/HoracioLaphitz/horaciolaphitz.github.io.git
cd horaciolaphitz.github.io

# Install dependencies
pnpm install
```

## 🏃 Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Type check
pnpm astro check

# Validate files
pnpm validate-files
```

## 🏗️ Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🌿 Git Workflow

This project follows a structured branching strategy:

### Main Branches

- `main`: Production code (protected)
- `develop`: Integration branch (protected)

### Supporting Branches

- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical production fixes
- `release/*`: Release preparation

See [Branch Strategy](.github/BRANCH_STRATEGY.md) for detailed workflow.

### Initialize Branches

```bash
# Windows
.\scripts\init-branches.ps1

# Linux/Mac
bash scripts/init-branches.sh
```

## 🚀 Deployment

### Automatic Deployment

- Push to `main` triggers automatic deployment to GitHub Pages
- Deployment workflow validates, builds, and deploys

### Manual Deployment

1. Go to Actions tab
2. Select "Deploy to GitHub Pages"
3. Click "Run workflow"

See [GitHub Pages Setup](.github/GITHUB_PAGES_SETUP.md) for configuration details.

## 📁 Project Structure

```
├── .github/
│   ├── workflows/          # CI/CD workflows
│   ├── BRANCH_STRATEGY.md  # Git workflow documentation
│   └── GITHUB_PAGES_SETUP.md
├── public/                 # Static assets
├── scripts/                # Build and utility scripts
├── src/
│   ├── application/        # Application services
│   ├── domain/            # Business logic
│   ├── infrastructure/    # External integrations
│   ├── presentation/      # UI components
│   └── pages/            # Astro pages
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vitest.config.ts       # Test configuration
```

## 🧪 Testing

```bash
# Run tests
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

## 📝 Scripts

| Script                | Description              |
| --------------------- | ------------------------ |
| `pnpm dev`            | Start development server |
| `pnpm build`          | Build for production     |
| `pnpm preview`        | Preview production build |
| `pnpm test`           | Run tests in watch mode  |
| `pnpm test:run`       | Run tests once           |
| `pnpm test:coverage`  | Run tests with coverage  |
| `pnpm validate`       | Run tests and type check |
| `pnpm validate-files` | Validate file sizes      |

## 🔒 Environment Variables

Create `.env` file in root:

```env
PUBLIC_WEB3FORMS_ACCESS_KEY=your_key_here
```

**Note**: Never commit `.env` files. Use GitHub Secrets for CI/CD.

## 🤝 Contributing

1. Create feature branch from `develop`

   ```bash
   git checkout develop
   git checkout -b feature/your-feature
   ```

2. Make changes and commit

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Push and create PR

   ```bash
   git push origin feature/your-feature
   ```

4. PR will be validated automatically
5. After approval, merge to `develop`

## 📚 Documentation

- [Branch Strategy](.github/BRANCH_STRATEGY.md)
- [GitHub Pages Setup](.github/GITHUB_PAGES_SETUP.md)
- [Astro Documentation](https://docs.astro.build/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🔗 Links

- **Portfolio**: [horaciolaphitz.github.io](https://horaciolaphitz.github.io)
- **LinkedIn**: [linkedin.com/in/horacio-laphitz](https://linkedin.com/in/horacio-laphitz)
- **GitHub**: [github.com/HoracioLaphitz](https://github.com/HoracioLaphitz)
- **Credly**: [credly.com/users/horacio-laphitz](https://www.credly.com/users/horacio-laphitz)

## 📧 Contact

**Email**: <horaciolaphitz99@gmail.com>

## 📄 License

MIT License © 2026 Horacio Laphitz

---

Built with ❤️ using Astro
