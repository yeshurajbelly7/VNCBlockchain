# NEXT STEPS (recommended follow-ups)

This file lists small, safe follow-ups you can do after this commit to further harden and tidy the repo.

1) Reintroduce ESLint rules incrementally
   - Re-enable `@typescript-eslint/no-unused-vars` as `warn` for a week, then fix violations and switch to `error`.
   - Re-enable `react-hooks/exhaustive-deps` and fix the most common cases by auditing effect dependencies.

2) Sentry SDK typings
   - Current code uses a small `any` cast to avoid a types mismatch. Either pin `@sentry/node` to the version matching the code, or update Sentry usage to the v10 API surface and remove the `any` cast.

3) Create a release branch & PR
   - Branch name suggestion: `release/prepare-for-deploy-YYYYMMDD`
   - Include a short changelog and link to `FINAL_PACKAGE_README.md`.

4) CI: enforce audit step
   - Add an `npm audit --audit-level=moderate` step to CI to fail if new vulnerabilities are introduced.

5) Produce a ZIP release
   - Create a reproducible zip from the main branch with built frontend `out/` or server builds and `dist/` for backend.

If you'd like, I can create the release branch and open the PR (I will need push access or you can create the branch and I'll prepare the patch/PR content). 
