// One Word, One Username, One Reward — make.fun entry program.
//
// The competition asks for exactly one thing: the entrant's own make.fun
// username, sent as a single word and nothing else. This program writes
// that username to /output/entry.txt, the artifact the house gate scorer
// and the username judge read.
//
// The handle is fixed in this file on purpose: it is the entrant's own
// make.fun username (@steady-raven-37), so there is nothing to look up,
// nothing to fetch and nothing that can vary between runs. The output is
// therefore deterministic: the same 16 bytes every time.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The entrant's own make.fun username — one word, no spaces, no gloss.
const USERNAME = "steady-raven-37";

// The house gate: UTF-8 text of 1 to 30 characters, not only whitespace.
const MAX_LENGTH = 30;

function checkUsername(name: string): void {
  if (name.length < 1 || name.length > MAX_LENGTH) {
    throw new Error(`username must be 1-${MAX_LENGTH} characters, got ${name.length}`);
  }
  if (name.trim().length === 0) {
    throw new Error("username must not be only whitespace");
  }
  if (/\s/.test(name)) {
    throw new Error("username must be a single word with no spaces");
  }
}

function main(): void {
  checkUsername(USERNAME);

  // The harness mounts the artifact directory at /output; honour an
  // OUTPUT_DIR override so the program can also be run locally.
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, USERNAME, "utf8");

  // Self-check: read the artifact back and confirm it is byte for byte
  // the username, with no trailing newline or padding tacked on. The
  // judge's fourth criterion is a single word with no padding, so the
  // file must hold exactly the handle and nothing else.
  const written = readFileSync(outPath, "utf8");
  if (written !== USERNAME) {
    throw new Error(`entry.txt mismatch: expected ${JSON.stringify(USERNAME)}, got ${JSON.stringify(written)}`);
  }
  if (Buffer.byteLength(written, "utf8") !== USERNAME.length) {
    throw new Error("entry.txt is not plain ASCII of the expected length");
  }
  console.log(`wrote ${USERNAME.length} characters to ${outPath}`);
}

main();
