# Contributing

This repository contains a personal portfolio. Focus contributions on factual corrections, accessibility, security, reliability, and maintainable implementation.

## Development checks

From the repository root:

```powershell
pnpm install --frozen-lockfile
pnpm astro check
pnpm test:run
pnpm build
```

Keep changes focused, avoid committing secrets or generated build output, and describe the affected routes or components in the pull request. Do not include private data in issues or patches.
