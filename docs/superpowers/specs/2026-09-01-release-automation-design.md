# Automatic Release Pipeline Design

Date: 2026-09-01

## Goal

Eliminate the manual GitHub release/tag steps. The intended future flow is:

1. Code changes are committed to `dev-stage-composition`.
2. A deliberate package version bump marks a release candidate.
3. GitHub validates the version and repository state.
4. GitHub creates the matching `v<version>` tag automatically.
5. The Windows NSIS build runs and publishes the release assets automatically.
6. The existing Electron auto-updater can consume `latest.yml` and the installer assets.

The user must no longer manually create a tag or publish a GitHub Release.

## Existing flow to preserve

`.github/workflows/release.yml` currently builds on `windows-latest`, installs with `npm install`, and publishes with:

`npx electron-builder --win nsis --publish always`

The existing builder configuration in `package.json` publishes to `communauticneu/webbased-academy-updates` and creates the NSIS installer, blockmap and `latest.yml`.

The Windows build/publish command itself remains unchanged.

## Important GitHub Actions constraint

A tag pushed by a workflow using the repository `GITHUB_TOKEN` does not reliably trigger a second workflow run because GitHub suppresses recursive workflow events. Therefore the design must not depend on "workflow A creates tag -> tag event starts workflow B".

Instead, the automatic release path creates the tag and then runs the existing build/publish command in the same workflow run.

The existing tag trigger remains available as a fallback for externally/manual-created tags.

## Trigger

Automatic release starts only on a push to `dev-stage-composition` where `package.json` changed.

This makes the version bump the explicit release signal. Ordinary source-code commits do not release anything.

## Validation and safety gates

Before a release build starts, the workflow must:

- read `version` from `package.json`;
- require strict semantic version format `x.y.z`;
- derive the tag exactly as `v<version>`;
- verify that the current branch is `dev-stage-composition` for the automatic path;
- verify that the derived tag does not already exist;
- run the automated test suite before creating the tag;
- stop immediately if any validation or test fails;
- create the tag only after all checks are green;
- publish only the version represented by that exact package version.

For a tag-triggered fallback run, the workflow must verify that the incoming tag equals `v<package.json version>` before publishing.

## Workflow structure

The existing `.github/workflows/release.yml` remains the single release workflow but gains a small preparation section before the existing Windows build steps.

Events:

- `push` to tag `v*.*.*` (existing fallback behavior)
- `push` to branch `dev-stage-composition` with path `package.json` (new automatic release path)
- `workflow_dispatch` remains available for diagnostics/manual recovery, but publishing still requires version/tag consistency.

Preparation phase:

1. Checkout with full history (`fetch-depth: 0`).
2. Setup Node 20.
3. Read and validate package version.
4. Determine whether this is automatic branch release or tag fallback.
5. Validate tag/version consistency and duplicate-tag state.
6. Install dependencies.
7. Run tests.
8. On automatic branch release only: create and push `v<version>` tag pointing at the exact triggering commit.

Build phase:

- run the existing electron-builder Windows publish command unchanged with `GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`.

## Duplicate and accidental release protection

A release is intentionally blocked when:

- the package version was not changed to a new version;
- the matching tag already exists;
- a tag does not match the package version;
- tests fail;
- the event is not one of the approved release paths.

This means a normal source commit cannot accidentally publish a new installer.

## Version discipline

Every release requires a unique package version. The release tag is derived from it and is never typed independently.

Current version is `0.16.29`. The first automated production test should use the next intentional version after the next actual feature/fix release rather than creating an empty release solely to test the mechanism.

## Testing strategy

Before enabling the production trigger, verify the workflow logic with automated/static tests that check:

- automatic branch trigger is restricted to `dev-stage-composition` and `package.json`;
- tag fallback is still present;
- package version is the single source for the tag;
- duplicate tags abort;
- mismatched tag/package versions abort;
- tests run before tag creation;
- tag creation runs before electron-builder publish;
- Windows publish command and `GH_TOKEN` remain intact.

After implementation, the next real version bump will be the end-to-end production proof. The resulting GitHub Actions run and release assets must be checked automatically before asking for any visual Creator validation.

## Non-goals

- No redesign of the Electron updater.
- No change to NSIS settings.
- No new release service or external deployment platform.
- No separate text-system changes in this task.
- No unrelated repository refactoring.
