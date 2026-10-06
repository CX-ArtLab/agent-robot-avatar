# Release checklist

This checklist is for project maintainers. Run releases from a clean `main` branch in the development repository.

## Automatic npm publishing

The `.github/workflows/publish-npm.yml` workflow publishes the matching release tag to npm when a GitHub Release is published. It uses npm trusted publishing (OIDC), with no `NPM_TOKEN` secret. A merged PR or a pushed tag alone does not publish a package.

### One-time npm setup

After the workflow is merged into `main`, open the `agent-robot-avatar` package settings on npmjs.com and add a GitHub Actions trusted publisher:

- Organization or user: `CX-ArtLab` (use this exact capitalization).
- Repository: `agent-robot-avatar`.
- Workflow filename: `publish-npm.yml` (filename only).
- Environment name: leave blank; the workflow does not use a GitHub environment.
- Allowed actions: enable direct publishing with `npm publish`.

See [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/). The workflow uses Node.js 24 and disables package-manager caching for release builds.

### New release

1. Update the package, lockfile, runtime version, demo references, and changelog. Merge the release PR.
2. Create the matching `v<package-version>` tag and publish its GitHub Release. Mark versions containing `-` as prereleases; stable versions must not be marked as prereleases.
3. Watch **Actions → Publish to npm**. The workflow checks the Release metadata and version, installs the three Playwright browsers, runs the existing full test suite and publish-tag guard, reviews the package through a dry run, then publishes the checked source.
4. Verify the exact version with `npm view agent-robot-avatar@<version> version` and check `npm view agent-robot-avatar dist-tags --json`.

Stable versions publish to `latest`; prereleases publish to `next`. Publish stable releases in increasing version order so `latest` does not move backwards. npm refuses to overwrite an already published package version.

### Backfill or retry an existing GitHub Release

Publishing a Release before this workflow is installed does not trigger it retroactively. After the one-time npm setup, use **Actions → Publish to npm → Run workflow**, select `main`, and enter the existing published Release tag (for example `v0.5.0`). This also supports retrying a failed publish. The workflow checks out that tag, not the current `main` source. Do not rerun a version already published to npm.

## Manual npm publishing (fallback)

1. Confirm the version and changelog are ready.
2. Sign in with `npm login --registry=https://registry.npmjs.org/`.
3. Run `npm run release:check`.
4. Review the dry-run file list and confirm all checks pass.
5. For an approved stable release, run `npm publish --tag latest`.
6. Verify the published package with `npm view agent-robot-avatar`.

The package configuration fixes the publish target to the official npm registry even when the machine uses another registry for installs. Actual publishing also runs the complete test suite automatically.

Prerelease versions must use the npm `next` tag. A publish-time guard rejects attempts to publish a prerelease with the default `latest` tag. Stable releases use the npm `latest` tag.

## GitHub release

With automatic publishing configured, publish the GitHub Release first, then verify the npm workflow result. For the manual fallback, verify npm before publishing the GitHub Release; the automatic workflow will reject a version that is already published. Never overwrite the existing `v0.1.0` release.
