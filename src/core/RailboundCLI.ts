import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import CLIConstants from "../utils/CLIConstants";
import CLIUtilities from "../utils/CLIUtilities";
import type {
    DemoDeployResponse,
    DeployDemoFetch,
    DeployDemoResult,
    LogLine,
    RailboundCLIDeps,
    ReadPackageFile,
    RunDeployDemoInput
} from "../utils/CLITypes";

export default class RailboundCLI {
    private readonly deps: RailboundCLIDeps;
    private readonly fetchImpl: DeployDemoFetch;
    private readonly log: LogLine;
    private readonly env: NodeJS.ProcessEnv;

    private initDone = false;
    private cliVersion = "";
    private entrySha256 = "";
    private packageJsonSha256 = "";

    constructor(deps: RailboundCLIDeps = {}) {
        this.deps = deps;
        this.fetchImpl = deps.fetchImpl ?? fetch;
        this.log = deps.log ?? console.log;
        this.env = deps.env ?? process.env;
    }

    #ensureInitialized(): void {
        if (this.initDone) {
            return;
        }
        this.initDone = true;

        const injected = this.deps.diagnostics;
        if (injected) {
            this.cliVersion = injected.version;
            this.entrySha256 = injected.entrySha256;
            this.packageJsonSha256 = injected.packageJsonSha256;
            return;
        }

        const readUtf8: ReadPackageFile = this.deps.readPackageFile ?? ((path, enc) => readFileSync(path, enc));
        const readBinary = this.deps.readBinaryFile ?? ((path: string) => readFileSync(path));

        const entryPath = __filename;
        const packageJsonPath = join(dirname(__filename), "..", "package.json");
        this.cliVersion = CLIUtilities.readPackageVersion(readUtf8, packageJsonPath);
        this.entrySha256 = CLIUtilities.sha256HexOfFile(readBinary, entryPath);
        this.packageJsonSha256 = CLIUtilities.sha256HexOfFile(readBinary, packageJsonPath);
    }

    public async run(argv: string[] = process.argv): Promise<void> {
        this.#ensureInitialized();
        const args = argv.slice(2);
        await this.routeCommand(args);
    }

    public printRailboundHelp(): void {
        this.#ensureInitialized();
        this.log(`${CLIConstants.Commands.NAME} v${this.cliVersion}`);
        this.log("");
        this.log(CLIConstants.HelpText.COMMANDS_HEADER);
        this.log(CLIConstants.HelpText.HELP_COMMAND_LINE);
        this.log(CLIConstants.HelpText.DEPLOY_DEMO_COMMAND_LINE);
        this.log("");
        this.log(`${CLIConstants.HelpText.DOCUMENTATION_LABEL}: ${CLIConstants.Links.DOCS_URL}`);
        this.log(`${CLIConstants.HelpText.SOURCE_LABEL}: ${CLIConstants.Links.SOURCE_URL}`);
        this.log("");
    }

    public async runDeployDemo(input: Omit<RunDeployDemoInput, "fetchImpl"> = {}): Promise<DeployDemoResult> {
        this.#ensureInitialized();
        const { log = this.log, env = this.env } = input;
        const url = this.buildDemoDeployUrl(env);
        const response = await this.postDeployDemo(url);
        const text = await response.text();
        const body = CLIUtilities.parseResponseBody(text);
        RailboundCLI.assertDeployResponseOk(response.ok, response.status, text);

        const data = RailboundCLI.asDeployDemoResult(body);
        this.logDeployDemoSuccess(log, data);
        return data;
    }

    private async routeCommand(args: string[]): Promise<void> {
        if (args.length === 0) {
            this.printRailboundHelp();
            return;
        }

        const [command, subcommand] = args;
        switch (command) {
            case "help":
                this.printRailboundHelp();
                return;
            case "deploy":
                if (subcommand === "demo") {
                    await this.runDeployDemo();
                    return;
                }
                break;
            default:
                break;
        }

        throw new Error(`Unknown command: ${args.join(" ")}. ${CLIConstants.Messages.UNKNOWN_COMMAND_SUFFIX}`);
    }

    private buildDemoDeployUrl(env: NodeJS.ProcessEnv): string {
        const apiBase = CLIUtilities.getApiBase(env);
        return `${apiBase}${CLIConstants.Routes.DEMO_PATH}${CLIConstants.Routes.DEMO_STATIC_SITE_QUERY}`;
    }

    private async postDeployDemo(url: string): Promise<DemoDeployResponse> {
        return this.fetchImpl(url, {
            method: CLIConstants.Http.POST,
            headers: {
                [CLIConstants.Http.ACCEPT_HEADER]: CLIConstants.Http.APPLICATION_JSON,
                [CLIConstants.Http.CONTENT_TYPE_HEADER]: CLIConstants.Http.APPLICATION_JSON,
                [CLIConstants.Http.CLI_VERSION_HEADER]: this.cliVersion,
                [CLIConstants.Http.CLI_ENTRY_SHA256_HEADER]: this.entrySha256,
                [CLIConstants.Http.CLI_PACKAGE_JSON_SHA256_HEADER]: this.packageJsonSha256
            },
            body: CLIConstants.Http.EMPTY_JSON_BODY
        });
    }

    private static assertDeployResponseOk(ok: boolean, status: number, text: string): void {
        if (ok) {
            return;
        }
        throw new Error(`${CLIConstants.Messages.DEPLOY_FAILED_PREFIX} (${status}): ${text.slice(0, 500)}`);
    }

    private static asDeployDemoResult(body: unknown): DeployDemoResult {
        return (body && typeof body === "object" ? body : {}) as DeployDemoResult;
    }

    private logDeployDemoSuccess(log: LogLine, data: DeployDemoResult): void {
        const deploymentId = typeof data.deploymentId === "string" ? data.deploymentId : undefined;
        const urlHint = typeof data.urlHint === "string" ? data.urlHint : undefined;

        log("");
        log(CLIConstants.Messages.DEMO_DEPLOY_SUCCESS);
        if (deploymentId) {
            log(`${CLIConstants.Messages.DEPLOYMENT_ID_LABEL} ${deploymentId}`);
        }
        if (urlHint) {
            log(`${CLIConstants.Messages.URL_HINT_LABEL}${urlHint}`);
            log("");
            log(CLIConstants.Messages.URL_HINT_READY_NOTE);
        } else {
            log("");
            log(CLIConstants.Messages.URL_HINT_MISSING_NOTE);
        }
        log(CLIConstants.Messages.DEPLOYMENTS_NOTE);
        log("");
    }
}
