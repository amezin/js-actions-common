# Shared configuration and template for JavaScript/TypeScript GitHub Actions

## Files to copy

### Workflows

Those without `shared-` prefix in the name, except `publish-eslint-config.yml`:

- `.github/workflows/ci.yml`
- `.github/workflows/dependency-review.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/tags.yml`

### Configs

- `.editorconfig`
- `.gitignore`
- `.node-version`
- `.nvmrc`
- `.prettierignore`
- `.prettierrc.yml`
- `eslint.config.mjs`
- `package.json`
- `renovate.json`
- `tsconfig.json`
