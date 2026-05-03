const { test } = require("node:test");
const assert = require("node:assert/strict");
const { CLIConstants, CLIUtilities, RailboundCLI } = require("../dist/index.js");

test("readPackageVersion reads version field", () => {
  const readFile = () => JSON.stringify({ version: "9.9.9" });
  assert.equal(CLIUtilities.readPackageVersion(readFile, "/fake/package.json"), "9.9.9");
});

test("sha256HexOfFile returns lowercase hex for buffer", () => {
  const readBinary = () => Buffer.from("hello");
  assert.match(CLIUtilities.sha256HexOfFile(readBinary, "/any"), /^[a-f0-9]{64}$/);
});

test("sha256HexOfFile returns unavailable when read throws", () => {
  const readBinary = () => {
    throw new Error("no");
  };
  assert.equal(
    CLIUtilities.sha256HexOfFile(readBinary, "/x"),
    CLIConstants.Http.DIAGNOSTICS_UNAVAILABLE
  );
});

test("getApiBase uses default and trims trailing slash", () => {
  assert.equal(CLIUtilities.getApiBase({}), "https://api.railbound.io");
  assert.equal(CLIUtilities.getApiBase({ RAILBOUND_API_BASE: "https://api.example.test/" }), "https://api.example.test");
});

test("printRailboundHelp includes commands and links", () => {
  const lines = [];
  const cli = new RailboundCLI({
    diagnostics: { version: "1.0.0", entrySha256: "aa", packageJsonSha256: "bb" },
    fetchImpl: async () => ({ ok: true, status: 200, text: async () => "{}" }),
    log: (line) => lines.push(line)
  });
  cli.printRailboundHelp();
  const text = lines.join("\n");
  assert.match(text, /railbound v1\.0\.0/);
  assert.match(text, /deploy demo/);
  assert.match(text, /railbound\.io/);
  assert.match(text, /github\.com\/railbound-io\/railbound/);
});

test("runDeployDemo logs deployment fields and returns payload", async () => {
  const lines = [];
  const diagnostics = {
    version: "1.0.0",
    entrySha256: "entryhashdeadbeef",
    packageJsonSha256: "pkgjsonhashcafebabe"
  };
  const fetchImpl = async (url, init) => {
    assert.equal(url, "https://api.example.test/demo?staticSite=true");
    assert.equal(init.method, "POST");
    const h = init.headers;
    assert.equal(h[CLIConstants.Http.CLI_VERSION_HEADER], diagnostics.version);
    assert.equal(h[CLIConstants.Http.CLI_ENTRY_SHA256_HEADER], diagnostics.entrySha256);
    assert.equal(h[CLIConstants.Http.CLI_PACKAGE_JSON_SHA256_HEADER], diagnostics.packageJsonSha256);
    return {
      ok: true,
      text: async () =>
        JSON.stringify({ deploymentId: "d1", urlHint: "https://demo.example.railbound.io/" })
    };
  };
  const cli = new RailboundCLI({
    diagnostics,
    fetchImpl,
    log: (line) => lines.push(line),
    env: { RAILBOUND_API_BASE: "https://api.example.test" }
  });
  const out = await cli.runDeployDemo();
  assert.equal(out.deploymentId, "d1");
  assert.ok(lines.some((line) => line.includes("deploymentId:")));
  assert.ok(lines.some((line) => line.includes("url hint:")));
});

test("runDeployDemo throws when response is not ok", async () => {
  const fetchImpl = async () => ({
    ok: false,
    status: 500,
    text: async () => "server error"
  });
  const cli = new RailboundCLI({
    diagnostics: { version: "1.0.0", entrySha256: "a", packageJsonSha256: "b" },
    fetchImpl,
    log: () => {}
  });
  await assert.rejects(() => cli.runDeployDemo(), /Demo deploy failed \(500\)/);
});
