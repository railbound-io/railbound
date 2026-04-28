import { readFileSync } from "node:fs";
import { join } from "node:path";
import RailboundCLI from "./core/RailboundCLI";
import CLIUtilities from "./utils/CLIUtilities";

export type { DeployDemoFetch, DeployDemoResult, LogLine, ReadPackageFile, RunDeployDemoInput } from "./utils/CLITypes";
export { default as RailboundCLI } from "./core/RailboundCLI";
export { default as CLIUtilities } from "./utils/CLIUtilities";

export async function main(argv: string[] = process.argv): Promise<void> {
    const packageJsonPath = join(__dirname, "..", "package.json");
    const version = CLIUtilities.readPackageVersion(readFileSync, packageJsonPath);
    await new RailboundCLI(version).run(argv);
}

if (require.main === module) {
    main().catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(message);
        process.exit(1);
    });
}
