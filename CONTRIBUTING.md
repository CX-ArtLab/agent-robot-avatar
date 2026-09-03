# Contributing

Thanks for helping improve Agent Robot Avatar.

## Before opening an issue

Please check that the problem still exists on the latest `main` branch. For bugs, include:

- Browser and operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- A minimal example when possible

## Pull requests

Keep pull requests focused and small enough to review clearly.

Before submitting a PR:

- Preserve the dependency-free SVG + vanilla JavaScript approach unless a dependency is clearly justified
- Avoid changing unrelated animation behavior in the same PR
- Use the public component API in demos and examples instead of relying on internal fields
- Verify `index.html` and `examples/basic.html`
- Update documentation when the public API changes
- Update `CHANGELOG.md` for user-visible changes

## Public API changes

The public API is intentionally small. Changes to action names, attributes, custom events, or component behavior should be treated as compatibility-sensitive changes and documented clearly.

## License

By contributing, you agree that your contribution will be licensed under the project's MIT License.
