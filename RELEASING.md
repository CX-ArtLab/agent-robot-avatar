# Release checklist

This checklist is for project maintainers. Run releases from a clean `main` branch in the development repository.

## Queue changes for a batched release

Use `dev/expressions` to accumulate approved SVG expressions before releasing them together.

1. Save completed code and tests on this branch and record each approved feature under `CHANGELOG.md → Unreleased`. Keep the public version unchanged during development.
2. Add further approved expressions to the same branch. A branch commit is a saved development change, not a new release.
3. Wait for the maintainer's explicit approval to release the batch. Then run the full validation suite, prepare one version/changelog update, and review the changes before merging to `main`.
4. Follow the release checklist below to publish the approved batch. After release, start the next queue from the updated `main`.

Do not merge the queue branch, publish a Release/tag, or manually run deployment/publishing while the batch is waiting. The current Pages workflow deploys on qualifying pushes to `main`; npm publishes on a published GitHub Release. Saving this branch alone does not invoke either publication workflow.

## Automatic npm publishing

The `.github/workflows/publish-npm.yml` workflow publishes the matching release tag to npm when a GitHub Release is published. It uses npm trusted publishing (OIDC), with no `NPM_TOKEN` secret. A merged PR or a pushed tag alone does not publish a package.

### One-time npm setup

After the workflow is merged into `main`, open the `boopface` package settings on npmjs.com and add a GitHub Actions trusted publisher:

- Organization or user: `CX-ArtLab` (use this exact capitalization).
- Repository: `BoopFace` (case-sensitive).
- Workflow filename: `publish-npm.yml` (filename only).
- Environment name: leave blank; the workflow does not use a GitHub environment.
- Allowed actions: enable direct publishing with `npm publish`.

See [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/). The workflow uses Node.js 24 and disables package-manager caching for release builds.

Web validation and npm publishing use the official Playwright Docker image, with
browsers and OS dependencies preinstalled. Keep the image version in both workflows
aligned with `@playwright/test` in `package-lock.json` when upgrading Playwright.

### New release

1. Update the package, lockfile, runtime version, demo references, and changelog. Merge the release PR.
2. Create the matching `v<package-version>` tag and publish its GitHub Release. Mark versions containing `-` as prereleases; stable versions must not be marked as prereleases.
3. Watch **Actions → Publish to npm**. The workflow checks the Release metadata and version, installs the three Playwright browsers, runs the existing full test suite and publish-tag guard, reviews the package through a dry run, then publishes the checked source.
4. Verify the exact version with `npm view boopface@<version> version` and check `npm view boopface dist-tags --json`.

Stable versions publish to `latest`; prereleases publish to `next`. Publish stable releases in increasing version order so `latest` does not move backwards. npm refuses to overwrite an already published package version.

### Backfill or retry an existing GitHub Release

Publishing a Release before this workflow is installed does not trigger it retroactively. After the one-time npm setup, use **Actions → Publish to npm → Run workflow**, select `main`, and enter the existing published Release tag (for example `v0.5.0`). This also supports retrying a failed publish. The workflow checks out that tag, not the current `main` source. Do not rerun a version already published to npm.

## Manual npm publishing (fallback)

1. Confirm the version and changelog are ready.
2. Sign in with `npm login --registry=https://registry.npmjs.org/`.
3. Run `npm run release:check`.
4. Review the dry-run file list and confirm all checks pass.
5. For an approved stable release, run `npm publish --tag latest`.
6. Verify the published package with `npm view boopface`.

The package configuration fixes the publish target to the official npm registry even when the machine uses another registry for installs. Actual publishing also runs the complete test suite automatically.

Prerelease versions must use the npm `next` tag. A publish-time guard rejects attempts to publish a prerelease with the default `latest` tag. Stable releases use the npm `latest` tag.

## GitHub release

With automatic publishing configured, publish the GitHub Release first, then verify the npm workflow result. For the manual fallback, verify npm before publishing the GitHub Release; the automatic workflow will reject a version that is already published. Never overwrite the existing `v0.1.0` release.


## BoopFace Embedded releases

The embedded library has its own version in `embedded/lib/BoopFace/library.properties`,
`library.json`, and `Eyes::version()`. Keep these in agreement. Its release tags
are `eyes-v<version>` and never invoke npm publishing.

1. Run the Embedded Eyes CI checks, including all 28 firmware builds, library examples,
   native sanitizers, Web/WASM fidelity, offline browsers and simulator languages.
2. Record the version/date in `embedded/CHANGELOG.md` and merge the approved PR.
3. Publish the matching `eyes-v<version>` GitHub Release as a prerelease while
   hardware verification is pending. Do not mark it as the latest release: the
   latest Web release remains the target of the component download links.
4. Watch **Publish Embedded downloads**. It validates the embedded version, tests
   the core, and attaches `BoopFace-Embedded-<version>.zip` and the offline simulator.
   For local review: `node embedded/tools/package-release.mjs eyes-v<version> /tmp/BoopFace-Embedded.zip`.
5. Test that the ZIP has `BoopFace/library.properties`, `src`, the Arduino examples,
   and the MIT license. Verify both assets are downloadable without signing in.
6. Arduino Library Manager needs a repository with `library.properties` at its root;
   publish the same library snapshot to `CX-ArtLab/boopface-embedded`, tag the matching
   version there, and submit its URL to `arduino/library-registry`. Keep that snapshot
   synchronized for later embedded releases. Until listings are live, document ZIP/source installation.
7. Both library manifests must use `BoopFace` as the library name. For PlatformIO,
   sign in as `cxlab`, pack the complete library ZIP (including its license) with
   `pio pkg pack BoopFace-Embedded-<version>.zip --output BoopFace-<version>.tar.gz`,
   review the archive, then publish it with
   `pio pkg publish BoopFace-<version>.tar.gz --owner cxlab --type library`.
   Verify `pio pkg show cxlab/BoopFace@<version>` and install that version in a
   clean project. Published name/version pairs cannot be overwritten.
