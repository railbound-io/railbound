#!/usr/bin/env node
const { build } = require("esbuild");
const { chmodSync } = require("node:fs");
const path = require("path");

const root = path.join(__dirname, "..");
const entry = path.join(root, "src/index.ts");
const outfile = path.join(root, "dist/index.js");

async function main() {
  await build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    platform: "node",
    target: "node18",
    format: "cjs",
    banner: {
      js: "#!/usr/bin/env node"
    },
    sourcemap: false,
    minify: false
  });

  chmodSync(outfile, 0o755);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
