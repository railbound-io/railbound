import RailboundCLI from "./core/RailboundCLI";
import CLIUtilities from "./utils/CLIUtilities";

export type {
    DeployDemoFetch,
    DeployDemoResult,
    LogLine,
    RailboundCLIDeps,
    RailboundCLIDiagnostics,
    ReadPackageFile,
    RunDeployDemoInput
} from "./utils/CLITypes";
export { default as RailboundCLI } from "./core/RailboundCLI";
export { default as CLIConstants } from "./utils/CLIConstants";
export { default as CLIUtilities } from "./utils/CLIUtilities";

export async function main(argv: string[] = process.argv): Promise<void> {
    await new RailboundCLI().run(argv);
}

if (require.main === module) {
    main().catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(message);
        process.exit(1);
    });
}
