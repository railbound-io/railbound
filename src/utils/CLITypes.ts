export type ReadPackageFile = (path: string, encoding: "utf8") => string;
export type LogLine = (line: string) => void;
export type DeployDemoFetch = typeof fetch;

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