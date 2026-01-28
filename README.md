# Shared configuration and template for JavaScript/TypeScript GitHub Actions

## Files to copy

### Workflows

All workflows except `shared-*.yml` and `npm-publish.yml`:

- `.github/workflows/ci.yml` (needs to be modified, see comments in the file)
- `.github/workflows/codeql.yml` (needs to be modified, see comments in the file)
- `.github/workflows/dependency-review.yml`
- `.github/workflows/tags.yml`

Local workflow references (`uses: ./.github/workflows/*.yml`) must be replaced
with external references like:

```yml
jobs:
  shared:
    uses: amezin/js-actions-common/.github/workflows/shared-ci.yml@4383e5abf3fa3f1295a5f991a90427ce9af04ad1 # v2.1.0
```

### Configs

- `.editorconfig`
- `.gitignore`
- `.prettierignore` (needs to be modified, see comments in the file)
- `.prettierrc.yml`
- `eslint.config.mjs` (needs to be modified, see comments in the file)
- `.npmrc` (needs to be modified, see comments in the file)
- `action.yml` (needs to be modified, obviously)
- `package.json` (needs to be modified, see comments below)
- `renovate.json` (needs to be modified, see comments below)
- `tsconfig.json` (needs to be modified, see comments below)

In `package.json`, `name` and URLs obviously need to be replaced with the
action name and repository URLs. `workspace` must be removed.

In `renovate.json`, everything except `extends` is not necessary for actions.

In `tsconfig.json`, `"include"` won't be necessary in actions repositories.
