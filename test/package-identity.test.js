import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("Moru package exposes the new command and the existing command alias", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(pkg.name, "@taehwandev/moru-guard");
  assert.equal(pkg.bin["moru-guard"], "src/cli.js");
  assert.equal(pkg.bin.vibeguard, "src/cli.js");

  const version = JSON.parse(execFileSync("node", ["src/cli.js", "version", "--json"], {
    cwd: root,
    encoding: "utf8"
  }));
  assert.equal(version.name, pkg.name);
  assert.equal(version.version, pkg.version);
});

test("both CLI help languages display the Moru command", () => {
  for (const language of ["en", "ko"]) {
    const help = execFileSync("node", ["src/cli.js", "--help", "--lang", language], {
      cwd: root,
      encoding: "utf8"
    });
    assert.match(help, /^Moru Guard\n/);
    assert.match(help, /moru-guard audit /);
  }
});
