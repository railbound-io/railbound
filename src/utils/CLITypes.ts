export type ReadPackageFile = (path: string, encoding: "utf8") => string;
/** Read file bytes (e.g. `readFileSync(path)` with no encoding). */
export type ReadBinaryFile = (path: string) => Buffer;
export type LogLine = (line: string) => void;
export type DeployDemoFetch = typeof fetch;

/** Injected CLI install fingerprints for tests (skips disk reads in `ensureInitialized`). */
export type RailboundCLIDiagnostics = {
    version: string;
    entrySha256: string;
    packageJsonSha256: string;
};

export type RailboundCLIDeps = {
    fetchImpl?: DeployDemoFetch;
    log?: LogLine;
    env?: NodeJS.ProcessEnv;
    diagnostics?: RailboundCLIDiagnostics;
    readPackageFile?: ReadPackageFile;
    readBinaryFile?: ReadBinaryFile;
};

export type RunDeployDemoInput = {
  fetchImpl: DeployDemoFetch;
  log?: LogLine;
  env?: NodeJS.ProcessEnv;
};

export type DeployDemoResult = {
  deploymentId?: string;
  urlHint?: string;
  [key: string]: unknown;
};

export type DemoDeployResponse = {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
};