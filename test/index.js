const { test } = require("node:test");
const assert = require("node:assert/strict");
const { CLIUtilities, RailboundCLI } = require("../dist/index.js");

test("readPackageVersion reads version field", () => {
  const readFile = () => JSON.stringify({ version: "9.9.9" });
  assert.equal(CLIUtilities.readPackageVersion(readFile, "/fake/package.json"), "9.9.9");
});

test("getApiBase uses default and trims trailing slash", () => {
  assert.equal(CLIUtilities.getApiBase({}), "https://api.railbound.io");
  assert.equal(CLIUtilities.getApiBase({ RAILBOUND_API_BASE: "https://api.example.test/" }), "https://api.example.test");
});

test("printRailboundHelp includes commands and links", () => {
  const lines = [];
  const cli = new RailboundCLI("1.0.0", async () => ({ ok: true, status: 200, text: async () => "{}" }), (line) => lines.push(line));
  cli.printRailboundHelp();
  const text = lines.join("\n");
  assert.match(text, /railbound v1\.0\.0/);
  assert.match(text, /deploy demo/);
  assert.match(text, /railbound\.io/);
  assert.match(text, /github\.com\/railbound-io\/railbound/);
});

test("runDeployDemo logs deployment fields and returns payload", async () => {
  const lines = [];
  const fetchImpl = async (url) => {
    assert.equal(url, "https://api.example.test/demo?staticSite=true");
    return {
      ok: true,
      text: async () =>
        JSON.stringify({ deploymentId: "d1", urlHint: "https://demo.example.railbound.io/" })
    };
  };
  const cli = new RailboundCLI("1.0.0", fetchImpl, (line) => lines.push(line), {
    RAILBOUND_API_BASE: "https://api.example.test"
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
  const cli = new RailboundCLI("1.0.0", fetchImpl, () => {});
  await assert.rejects(() => cli.runDeployDemo(), /Demo deploy failed \(500\)/);
});
