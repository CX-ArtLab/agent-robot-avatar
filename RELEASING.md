# Release checklist

This checklist is for project maintainers. Run releases from a clean `main` branch in the development repository.

## npm package

1. Confirm the version and changelog are ready.
2. Sign in with `npm login --registry=https://registry.npmjs.org/`.
3. Run `npm run release:check`.
4. Review the dry-run file list and confirm all checks pass.
5. For an approved stable release, run `npm publish --tag latest`.
6. Verify the published package with `npm view agent-robot-avatar`.

The package configuration fixes the publish target to the official npm registry even when the machine uses another registry for installs. Actual publishing also runs the complete test suite automatically.

Prerelease versions must use the npm `next` tag. A publish-time guard rejects attempts to publish a prerelease with the default `latest` tag. Stable releases use the npm `latest` tag.

## GitHub release

After npm verification, synchronize the approved release changes to the public repository, create the matching tag, and publish the GitHub release notes. Never overwrite the existing `v0.1.0` release.
