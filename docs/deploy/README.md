# Lineamientos de Deploy — Portfolio-26

> **USO:** Leer completo antes de cada deploy. No comitear. Solo local.

---

## Pre-Deploy Checklist

### 1. Código y Tests
- [ ] `pnpm test:run` → todos los tests pasan
- [ ] `pnpm astro check` → 0 errores, 0 warnings
- [ ] `pnpm build` → 0 errores
- [ ] Sin `console.log` / `debugger` en `src/`
- [ ] Sin `any` types nuevos sin justificación

### 2. Seguridad
- [ ] `pnpm audit --audit-level=high` → revisar críticas
- [ ] Sin secretos en código (no `sk-`, `ghp_`, `xoxb-`, private keys)
- [ ] CSP headers intactos en `vercel.json`
- [ ] HSTS presente: `max-age=31536000; includeSubDomains; preload`
- [ ] Rate limiting activo en `github-raw.ts`
- [ ] Error sanitization en `ErrorState.tsx`

### 3. Datos y Contenido
- [ ] Sin `.env` ni `.env.local` en staging
- [ ] `PUBLIC_WEB3FORMS_ACCESS_KEY` configurado en Vercel
- [ ] Content collections sincronizadas (`pnpm sync:github` si aplica)
- [ ] Notebooks HTML actualizados (`pnpm build:notebooks` si aplica)

### 4. Performance
- [ ] `dist/` no tiene archivos > 5MB sin justificación
- [ ] Imágenes optimizadas (WebP/AVIF cuando posible)
- [ ] `inlineStylesheets: "auto"` en astro.config

### 5. Accesibilidad
- [ ] `min-h-11` en todos los touch targets (44px mínimo)
- [ ] `focus-ring` visible en interactivos
- [ ] `alt` text en todas las imágenes
- [ ] `role="alert"` en estados de error

---

## Post-Deploy Verification

### Automático (CI/CD)
- [ ] GitHub Actions: `validate-pr.yml` pasa (tests + build + seguridad)
- [ ] Vercel preview deployment exitoso

### Manual (5 min)
- [ ] Abrir sitio en producción
- [ ] Verificar headers de seguridad (DevTools → Network)
- [ ] Probar rutas principales: `/`, `/projects`, `/gracias`
- [ ] Verificar dashboard interactivo carga datos
- [ ] Probar en mobile (DevTools → Device toolbar)
- [ ] Verificar CSP no bloquea scripts legítimos

---

## Rollback Plan

Si algo falla en producción:

1. **Revertir commit**: `git revert HEAD`
2. **Re-deploy**: Vercel redeploya automáticamente en push a main
3. **Verificar**: Post-deploy checks nuevamente
4. **Comunicar**: Si hay impacto, documentar en CHANGELOG

---

## Contacto de Emergencia

- **Vercel Support**: https://vercel.com/support
- **GitHub Status**: https://www.githubstatus.com/
- **Dominio**: Verificar DNS si hay problemas de resolución

---

## Notas

- Los deploys a `main` son automáticos vía Vercel Git Integration
- Los deploys manuales se hacen desde el dashboard de Vercel (`Deploy` button)
- Nunca hacer push directo a main sin PR review
- Los secrets se rotan cada 90 días o al sospechar compromiso
