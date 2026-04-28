import CLIConstants from "./CLIConstants";
import type { ReadPackageFile } from "./CLITypes";

export default class CLIUtilities {
    public static readPackageVersion(readFile: ReadPackageFile, packageJsonPath: string): string {
        try {
            const raw = readFile(packageJsonPath, "utf8");
            const pkg = JSON.parse(raw) as { version?: string };
            return typeof pkg.version === "string"
                ? pkg.version
                : CLIConstants.Defaults.PACKAGE_FALLBACK_VERSION;
        } catch {
            return CLIConstants.Defaults.PACKAGE_FALLBACK_VERSION;
        }
    }

    private static normalizeApiBase(url: string): string {
        return url.endsWith("/") ? url.slice(0, -1) : url;
    }

    public static getApiBase(env: NodeJS.ProcessEnv = process.env): string {
        const fromEnv = typeof env.RAILBOUND_API_BASE === "string" ? env.RAILBOUND_API_BASE.trim() : "";
        return CLIUtilities.normalizeApiBase(fromEnv || CLIConstants.Defaults.API_BASE);
    }

    public static parseResponseBody(text: string): unknown {
        try {
            return text ? JSON.parse(text) : {};
        } catch {
            return { raw: text };
        }
    }
}
