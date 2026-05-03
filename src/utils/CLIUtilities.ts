import { createHash } from "node:crypto";
import CLIConstants from "./CLIConstants";
import type { ReadBinaryFile, ReadPackageFile } from "./CLITypes";

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

    /** SHA-256 hex of file bytes, or `DIAGNOSTICS_UNAVAILABLE` on any read error. */
    public static sha256HexOfFile(readBinary: ReadBinaryFile, absolutePath: string): string {
        try {
            const buf = readBinary(absolutePath);
            return createHash("sha256").update(buf).digest("hex");
        } catch {
            return CLIConstants.Http.DIAGNOSTICS_UNAVAILABLE;
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
