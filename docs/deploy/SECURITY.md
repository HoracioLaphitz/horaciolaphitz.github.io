# Security Hardening Guidelines — Portfolio-26

> **USO:** Referencia de seguridad. Leer antes de cambios sensibles. No comitear.

---

## Threat Model

### Assets
- **Público**: HTML, CSS, JS, imágenes, PDFs, notebooks
- **Sensivo**: N/A (portfolio personal, sin datos de usuarios)
- **Crítico**: Credenciales de deploy, API keys

### Trust Boundaries
1. **Usuario → CDN (Vercel Edge)**: HTTPS only, CSP enforced
2. **CDN → Origin (GitHub)**: HTTPS, HSTS (via vercel.json)
3. **Client → GitHub API**: Rate-limited, timeout, Content-Type validated
4. **Client → Web3Forms**: CSP `form-action` restricted

### Threats Addressed
| Threat | Mitigation |
|--------|------------|
| XSS | CSP `script-src 'self'`, no `unsafe-eval` |
| Clickjacking | `X-Frame-Options: DENY` |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| Data injection | Input validation in parsers.ts |
| Credential leak | Pre-commit hooks, CI scanning |
| DoS | Rate limiting, timeouts |
| Supply chain | Dependabot, pnpm audit |

---

## Secure Coding Rules

### DO
- Validar TODOS los datos externos (GitHub API, CSV, JSON)
- Usar `sanitizeErrorMessage()` para errores visibles
- Mantener CSP restrictiva
- Usar `rel="noopener noreferrer"` en links externos
- Escapar HTML en contenido dinámico
- Usar `Astro.props` validados con Zod cuando sea complejo

### DON'T
- Nunca `eval()` ni `new Function()`
- Nunca `innerHTML` con datos no sanitizado
- Nunca loggear datos sensibles
- Nunca hardcodear secrets
- Nunca desactivar CSP sin justificación documentada
- Nunca hacer `fetch()` sin timeout

---

## Dependency Security

### Weekly
- Dependabot abre PRs automáticos
- Revisar y mergear si tests pasan

### Monthly
- `pnpm audit --audit-level=high`
- Revisar vulnerabilidades críticas
- Actualizar `devDependencies` si hay fixes

### Quarterly
- Revisar dependencias sin uso (`pnpm depcheck`)
- Evaluar alternativas más seguras
- Actualizar `packageManager` version si hay fixes de seguridad

---

## Secret Management

### Allowed in Code
- `PUBLIC_*` variables (solo datos públicos)
- URLs públicas
- Datos de contacto profesionales

### NEVER in Code
- API keys (GitHub, OpenAI, etc.)
- Private keys (SSH, SSL)
- Tokens de acceso
- Passwords
- Web3Forms access key (usar `PUBLIC_` prefix + CI secret)

### Rotation Schedule
- GitHub tokens: 90 días
- Web3Forms key: Al sospechar compromiso
- CI secrets: Anualmente mínimo

---

## Incident Response

### Si se filtra un secreto:
1. **Revocar inmediatamente** el token/key comprometido
2. **Rotar** todas las credenciales relacionadas
3. **Auditar** logs de acceso si están disponibles
4. **Documentar** en CHANGELOG (sin detalles sensibles)
5. **Actualizar** secrets en Vercel/CI

### Si se detecta vulnerabilidad:
1. **Evaluar severidad** (CVSS score)
2. **Aplicar fix** o mitigación temporal
3. **Testear** que el fix no rompe funcionalidad
4. **Deploy** con prioridad
5. **Documentar** en SECURITY.md si aplica

---

## Compliance

- **OWASP Top 10**: Mitigaciones aplicadas
- **CSP Level 2**: Implementado
- **HTTPS**: Forzado vía HSTS
- **No PII**: El portfolio no recopila datos personales de visitantes
