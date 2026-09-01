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
  assert.match(workflow, /git show-ref --verify --quiet ["']refs\/tags\/\$tag["']/);
  assert.match(workflow, /already exists/i);
  assert.match(workflow, /does not match package version/i);
  assert.match(workflow, /exit 1/);
});

test('manual recovery is allowed only from the matching release tag', () => {
  assert.match(workflow, /GITHUB_EVENT_NAME -eq 'workflow_dispatch'/);
  assert.match(workflow, /GITHUB_REF_TYPE -ne 'tag'/);
  assert.match(workflow, /dispatch tag .* does not match package version/i);
});

test('tests run before automatic tag creation, and tag creation runs before publish', () => {
  const tests = indexOfOrFail('npm test');
  const tagCreate = indexOfOrFail('git tag "$env:RELEASE_TAG" "$env:GITHUB_SHA"');
  const publish = indexOfOrFail('gh release upload "$env:RELEASE_TAG"');
  assert.ok(tests < tagCreate, 'tests must run before tag creation');
  assert.ok(tagCreate < publish, 'tag creation must run before publish');
});

test('Windows release is built once and all updater assets are uploaded deterministically', () => {
  assert.match(workflow, /runs-on: windows-latest/);
  assert.match(workflow, /node-version: 20/);
  assert.match(workflow, /npx electron-builder --win nsis --publish never/);
  assert.match(workflow, /gh release create "\$env:RELEASE_TAG"/);
  assert.match(workflow, /gh release upload "\$env:RELEASE_TAG"/);
  assert.ok(workflow.includes('Webbased-Academy-Creator-Setup-$env:RELEASE_VERSION.exe'));
  assert.ok(workflow.includes('Webbased-Academy-Creator-Setup-$env:RELEASE_VERSION.exe.blockmap'));
  assert.ok(workflow.includes('latest.yml'));
  assert.match(workflow, /gh release view "\$env:RELEASE_TAG" --json assets/);
  assert.equal(workflow.includes('--publish always'), false);
});
