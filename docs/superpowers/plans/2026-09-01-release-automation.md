# Automatic Release Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make a deliberate `package.json` version bump on `dev-stage-composition` automatically validate, tag, build, and publish a Windows release without manual GitHub tag/release clicks.

**Architecture:** Keep `.github/workflows/release.yml` as the single release workflow. Add a branch+path release trigger and a guarded preparation phase that derives `v<version>` from `package.json`, validates event/version/tag state, installs dependencies, runs tests, creates the tag only for the approved branch path, then runs the existing electron-builder publish command unchanged.

**Tech Stack:** GitHub Actions YAML, PowerShell on `windows-latest`, Node.js 20, npm, electron-builder, GitHub CLI (`gh`) available on GitHub-hosted runners.

**Spec:** `docs/superpowers/specs/2026-09-01-release-automation-design.md`

## Global Constraints

- Automatic publishing is allowed only for `push` to `dev-stage-composition` with `package.json` changed.
- Existing `push` tag trigger `v*.*.*` remains as fallback.
- `workflow_dispatch` remains available for diagnostics/recovery but must not bypass version/tag consistency.
- `package.json` version is the single source of truth and must match strict `x.y.z`.
- Automatic tag is exactly `v<package.json version>` and must point to the triggering commit.
- Existing tags must abort the automatic branch release.
- Tag-triggered fallback must abort if incoming tag differs from `v<package.json version>`.
- `npm test` must pass before any automatic tag is created.
- Existing publish command remains exactly `npx electron-builder --win nsis --publish always`.
- Existing `GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` publishing environment remains intact.
- No updater, NSIS, text-system, or unrelated refactoring changes in this task.

---

### Task 1: Add release-workflow contract tests

**Files:**
- Create: `test/release-workflow.test.js`
- Read: `.github/workflows/release.yml`

**Interfaces:**
- Consumes: workflow file as UTF-8 text.
- Produces: static regression contract proving release triggers, safety gates, test ordering, tag creation ordering, and unchanged publish command.

- [ ] **Step 1: Write the failing workflow contract test**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const workflow = fs.readFileSync(
  path.join(__dirname, '..', '.github', 'workflows', 'release.yml'),
  'utf8'
);

function indexOfOrFail(needle) {
  const index = workflow.indexOf(needle);
  assert.notEqual(index, -1, `missing workflow fragment: ${needle}`);
  return index;
}

test('automatic release is limited to package version pushes on dev-stage-composition', () => {
  assert.match(workflow, /branches:\s*\n\s*- dev-stage-composition/);
  assert.match(workflow, /paths:\s*\n\s*- ['"]package\.json['"]/);
  assert.match(workflow, /tags:\s*\n\s*- ['"]v\*\.\*\.\*['"]/);
  assert.match(workflow, /workflow_dispatch:/);
});

test('package version is the single source of the release tag and semver is validated', () => {
  assert.match(workflow, /node -p ["']require\(['"]\.\/package\.json['"]\)\.version["']/);
  assert.match(workflow, /\^\\d\+\\\.\\d\+\\\.\\d\+\$/);
  assert.match(workflow, /v\$version/);
});

test('duplicate tags and tag-version mismatch are explicit hard failures', () => {
  assert.match(workflow, /git rev-parse .*refs\/tags\/\$tag/);
  assert.match(workflow, /already exists/i);
  assert.match(workflow, /does not match package version/i);
  assert.match(workflow, /exit 1/);
});

test('tests run before automatic tag creation, and tag creation runs before publish', () => {
  const tests = indexOfOrFail('npm test');
  const tagCreate = indexOfOrFail('git tag "$env:RELEASE_TAG" "$env:GITHUB_SHA"');
  const publish = indexOfOrFail('npx electron-builder --win nsis --publish always');
  assert.ok(tests < tagCreate, 'tests must run before tag creation');
  assert.ok(tagCreate < publish, 'tag creation must run before publish');
});

test('existing Windows publishing contract is preserved', () => {
  assert.match(workflow, /runs-on: windows-latest/);
  assert.match(workflow, /node-version: 20/);
  assert.match(workflow, /npx electron-builder --win nsis --publish always/);
  assert.match(workflow, /GH_TOKEN: \$\{\{ secrets\.GITHUB_TOKEN \}\}/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test test/release-workflow.test.js`

Expected: FAIL because the current workflow lacks the branch/path trigger and validation/tag-preparation logic.

- [ ] **Step 3: Commit the failing contract test**

```bash
git add test/release-workflow.test.js
git commit -m "test: define automatic release workflow contract"
```

---

### Task 2: Implement guarded automatic release preparation

**Files:**
- Modify: `.github/workflows/release.yml`
- Test: `test/release-workflow.test.js`

**Interfaces:**
- Consumes: GitHub event context, `package.json` version, repository tags, test suite.
- Produces: `RELEASE_VERSION`, `RELEASE_TAG`, validated release path, and for automatic branch releases a new tag pointing exactly at `GITHUB_SHA`.

- [ ] **Step 1: Expand workflow triggers without changing the existing tag fallback**

Set the event block to:

```yaml
on:
  workflow_dispatch:
  push:
    branches:
      - dev-stage-composition
    paths:
      - 'package.json'
    tags:
      - 'v*.*.*'
```

- [ ] **Step 2: Checkout full history and preserve Node 20**

Use:

```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
    fetch-depth: 0

- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: 20
```

- [ ] **Step 3: Add PowerShell release-context validation before dependency installation**

Add:

```yaml
- name: Validate release context
  shell: pwsh
  run: |
    $ErrorActionPreference = 'Stop'
    $version = node -p "require('./package.json').version"
    if ($version -notmatch '^\d+\.\d+\.\d+$') {
      Write-Error "package.json version '$version' is not strict x.y.z semver"
      exit 1
    }

    $tag = "v$version"
    "RELEASE_VERSION=$version" | Out-File -FilePath $env:GITHUB_ENV -Append -Encoding utf8
    "RELEASE_TAG=$tag" | Out-File -FilePath $env:GITHUB_ENV -Append -Encoding utf8

    if ($env:GITHUB_EVENT_NAME -eq 'push' -and $env:GITHUB_REF_TYPE -eq 'branch') {
      if ($env:GITHUB_REF_NAME -ne 'dev-stage-composition') {
        Write-Error "automatic release is only allowed from dev-stage-composition"
        exit 1
      }
      if (git rev-parse --verify --quiet "refs/tags/$tag") {
        Write-Error "release tag $tag already exists"
        exit 1
      }
      "AUTO_RELEASE=true" | Out-File -FilePath $env:GITHUB_ENV -Append -Encoding utf8
      exit 0
    }

    if ($env:GITHUB_EVENT_NAME -eq 'push' -and $env:GITHUB_REF_TYPE -eq 'tag') {
      if ($env:GITHUB_REF_NAME -ne $tag) {
        Write-Error "incoming tag $env:GITHUB_REF_NAME does not match package version $tag"
        exit 1
      }
      "AUTO_RELEASE=false" | Out-File -FilePath $env:GITHUB_ENV -Append -Encoding utf8
      exit 0
    }

    if ($env:GITHUB_EVENT_NAME -eq 'workflow_dispatch') {
      if ($env:GITHUB_REF_TYPE -eq 'tag' -and $env:GITHUB_REF_NAME -ne $tag) {
        Write-Error "dispatch tag $env:GITHUB_REF_NAME does not match package version $tag"
        exit 1
      }
      Write-Error "workflow_dispatch is diagnostic/recovery only; run it from the matching release tag"
      exit 1
    }

    Write-Error "unsupported release event"
    exit 1
```

- [ ] **Step 4: Keep dependency install, then run all tests before tag creation**

Use:

```yaml
- name: Install dependencies
  run: npm install

- name: Run tests
  run: npm test
```

- [ ] **Step 5: Create and push the exact version tag only on automatic branch releases**

Add:

```yaml
- name: Create release tag
  if: env.AUTO_RELEASE == 'true'
  shell: pwsh
  run: |
    git config user.name "github-actions[bot]"
    git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
    git tag "$env:RELEASE_TAG" "$env:GITHUB_SHA"
    git push origin "$env:RELEASE_TAG"
```

- [ ] **Step 6: Preserve the existing Windows publish command exactly**

Keep:

```yaml
- name: Build and publish Windows release
  run: npx electron-builder --win nsis --publish always
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 7: Run the focused contract test and full test suite**

Run:

```bash
node --test test/release-workflow.test.js
npm test
```

Expected: both commands PASS.

- [ ] **Step 8: Commit workflow implementation**

```bash
git add .github/workflows/release.yml test/release-workflow.test.js
git commit -m "ci: automate versioned Windows releases"
```

---

### Task 3: Static safety verification and production handoff

**Files:**
- Verify: `.github/workflows/release.yml`
- Verify: `package.json`
- Verify: `test/release-workflow.test.js`

**Interfaces:**
- Consumes: committed implementation.
- Produces: evidence that ordinary source commits cannot release, version bump is the explicit signal, duplicate/mismatched tags fail, tests precede tag creation, and publish behavior is unchanged.

- [ ] **Step 1: Verify current production version remains 0.16.29**

Run:

```bash
node -p "require('./package.json').version"
```

Expected: `0.16.29`.

- [ ] **Step 2: Verify no release is triggered by the automation implementation itself**

Reason: the automatic branch trigger includes `paths: ['package.json']`; this implementation changes only the workflow/test/docs and therefore must not produce a new release.

- [ ] **Step 3: Inspect the committed workflow ordering**

Required order:

```text
Checkout -> Setup Node -> Validate release context -> Install dependencies -> Run tests -> Create release tag (automatic branch only) -> Build and publish Windows release
```

- [ ] **Step 4: Verify the next real feature/fix release will be the end-to-end proof**

The next intentional `package.json` bump above `0.16.29` must automatically create its matching tag and publish installer, blockmap, and `latest.yml`. No empty test release is created solely for the pipeline.
