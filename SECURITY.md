# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this portfolio, please report it by:

1. **DO NOT** open a public issue
2. Email the maintainer directly (check package.json for contact)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## Security Measures

This project implements multiple security layers:

### 1. Automated Dependency Scanning
- **Dependabot**: Weekly automated dependency updates
- **npm audit**: Runs on every PR and push to main
- **pip-audit**: Scans Python dependencies for vulnerabilities

### 2. Pre-Commit Hooks
- **Secret Detection**: Blocks commits containing credentials
- **File Size Validation**: Prevents large files from being committed
- **YAML/JSON Validation**: Ensures configuration files are valid

### 3. Static Code Analysis
- **Bandit**: SAST scanning for Python code
- **TypeScript**: Strict type checking prevents common bugs

### 4. CI/CD Security
- **Validation Gates**: TypeScript and tests must pass before deployment
- **Artifact Scanning**: Build artifacts are validated before deployment
- **Minimal Permissions**: GitHub Actions use least-privilege principle

## Security Best Practices

### For Contributors

1. **Never commit credentials**
   - Use `.env` files (already in .gitignore)
   - Use environment variables in CI/CD
   - Use GitHub Secrets for sensitive data

2. **Keep dependencies updated**
   - Review and merge Dependabot PRs promptly
   - Run `pnpm audit` regularly
   - Update to latest stable versions

3. **Follow secure coding practices**
   - Validate all user inputs
   - Use parameterized queries
   - Sanitize HTML output
   - Avoid eval() and similar dangerous functions

4. **Review security audit reports**
   - Check GitHub Actions security audit workflow
   - Download and review audit artifacts
   - Fix HIGH/CRITICAL vulnerabilities immediately

### For Maintainers

1. **Monitor security advisories**
   - Enable GitHub Security Advisories
   - Subscribe to security mailing lists for dependencies
   - Review CVE databases regularly

2. **Rotate secrets regularly**
   - Update API keys quarterly
   - Rotate deployment tokens
   - Review access permissions

3. **Audit access controls**
   - Review repository collaborators
   - Audit GitHub Actions permissions
   - Review branch protection rules

## Security Checklist

Before each release:

- [ ] Run `pnpm security:audit`
- [ ] Review Dependabot PRs
- [ ] Check for exposed secrets in git history
- [ ] Verify all tests pass
- [ ] Review security audit workflow results
- [ ] Update dependencies to latest stable versions

## Known Security Considerations

### GitHub Pages Deployment
- Site is publicly accessible
- No server-side authentication
- Static content only
- HTTPS enforced by GitHub

### Data Privacy
- No user data collection
- No cookies or tracking (except GitHub Pages analytics)
- No third-party scripts (except essential CDNs)

### Content Security
- All user-generated content is sanitized
- DOMPurify used for HTML sanitization
- No inline scripts in production

## Security Tools

### Installed Tools
- `pip-audit`: Python dependency scanner
- `bandit`: Python SAST scanner
- `pre-commit`: Git hook framework
- `pnpm audit`: npm dependency scanner

### Recommended Tools
- `snyk`: Additional vulnerability scanning
- `trivy`: Container and filesystem scanning
- `gitleaks`: Secret scanning in git history

## Compliance

This project follows:
- OWASP Top 10 security practices
- GitHub Security Best Practices
- npm Security Best Practices
- Python Security Best Practices

## Contact

For security concerns, contact:
- Email: [Check package.json]
- GitHub: [@HoracioGuzman](https://github.com/HoracioGuzman)

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who report vulnerabilities.

---

Last updated: 2026-05-15
