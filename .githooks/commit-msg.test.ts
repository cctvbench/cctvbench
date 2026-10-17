import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const hook = join(import.meta.dirname, 'commit-msg');
const dir = mkdtempSync(join(tmpdir(), 'commit-msg-'));

function run(message: string) {
  const file = join(dir, `${Math.random().toString(36).slice(2)}.txt`);
  writeFileSync(file, message);
  const result = spawnSync('sh', [hook, file], { encoding: 'utf8' });
  return { ok: result.status === 0, stderr: result.stderr };
}

describe('commit-msg hook', () => {
  it('accepts the documented format', () => {
    expect(run('feat: #12 add the bandwidth calculator').ok).toBe(true);
    expect(run('fix(rtsp): #3 reject an empty path').ok).toBe(true);
    expect(run('refactor!: #40 drop the legacy url state').ok).toBe(true);
    expect(run('chore: #0 bump biome').ok).toBe(true);
    expect(run('docs: #2 pin the toolchain\n\nNode 22 and Astro 7.\nDependabot monthly.\n').ok).toBe(true);
  });

  it('lets git-generated messages through', () => {
    expect(run("Merge branch 'main' into scaffold").ok).toBe(true);
    expect(run('Revert "feat: #12 add the bandwidth calculator"\n\nThis reverts commit abc123.').ok).toBe(true);
    expect(run('fixup! feat: #12 add the bandwidth calculator').ok).toBe(true);
  });

  it('rejects a missing issue reference or an unknown type', () => {
    const noIssue = run('feat: add the bandwidth calculator');
    expect(noIssue.ok).toBe(false);
    expect(noIssue.stderr).toContain('feat: #12 add the bandwidth calculator');
    expect(run('feature: #12 add the bandwidth calculator').ok).toBe(false);
    expect(run('feat: DEV-12 add the bandwidth calculator').ok).toBe(false);
    expect(run('feat: #12').ok).toBe(false);
  });

  it('rejects a long subject, a body over three lines, and trailers', () => {
    expect(run(`feat: #12 ${'x'.repeat(70)}`).ok).toBe(false);
    expect(run('feat: #12 add thing\n\none\ntwo\nthree\nfour\n').ok).toBe(false);
    expect(run('feat: #12 add thing\n\nwhy\n\nCo-Authored-By: Someone <x@y.z>\n').ok).toBe(false);
  });

  it('ignores comment lines from the commit template', () => {
    expect(run('# Please enter the commit message\nfeat: #12 add thing\n# Changes to be committed:\n').ok).toBe(true);
  });
});
