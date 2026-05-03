export default class CLIConstants {
    public static readonly Defaults = {
        API_BASE: "https://api.railbound.io",
        PACKAGE_FALLBACK_VERSION: "0.0.0"
    } as const;

    public static readonly Routes = {
        DEMO_PATH: "/demo",
        DEMO_STATIC_SITE_QUERY: "?staticSite=true"
    } as const;

    public static readonly Commands = {
        NAME: "railbound",
        DESCRIPTION: "Railbound CLI",
        HELP_DESCRIPTION: "Show version, commands, and links",
        DEPLOY_GROUP_DESCRIPTION: "Deployment commands",
        DEPLOY_DEMO_DESCRIPTION: "Create a static-site demo via api.railbound.io",
        VERSION_FLAG: "-V, --version",
        VERSION_DESCRIPTION: "Print version"
    } as const;

    public static readonly Links = {
        DOCS_URL: "https://railbound.io/docs",
        SOURCE_URL: "https://github.com/railbound-io/railbound"
    } as const;

    public static readonly Http = {
        POST: "POST",
        ACCEPT_HEADER: "accept",
        CONTENT_TYPE_HEADER: "content-type",
        APPLICATION_JSON: "application/json",
        EMPTY_JSON_BODY: "{}",
        CLI_VERSION_HEADER: "x-railbound-cli-version",
        CLI_ENTRY_SHA256_HEADER: "x-railbound-cli-entry-sha256",
        CLI_PACKAGE_JSON_SHA256_HEADER: "x-railbound-cli-package-json-sha256",
        /** Sentinel for hash headers when the file cannot be read (diagnostics only). */
        DIAGNOSTICS_UNAVAILABLE: "unavailable"
    } as const;

    public static readonly HelpText = {
        COMMANDS_HEADER: "Commands:",
        HELP_COMMAND_LINE: "  help          Show this message",
        DEPLOY_DEMO_COMMAND_LINE: "  deploy demo   POST a static-site demo deployment to api.railbound.io",
        DOCUMENTATION_LABEL: "Documentation",
        SOURCE_LABEL: "Source & issues"
    } as const;

    public static readonly Messages = {
        DEMO_DEPLOY_SUCCESS: "Demo deployment request succeeded.",
        DEPLOYMENT_ID_LABEL: "  deploymentId:",
        URL_HINT_LABEL: "  url hint:     ",
        URL_HINT_READY_NOTE: "Open the url hint in a browser when your deployment is ready.",
        URL_HINT_MISSING_NOTE: "Check the API response for your deployment URL (urlHint was not returned).",
        UNKNOWN_COMMAND_SUFFIX: "Use \"help\" to view supported commands.",
        DEPLOY_FAILED_PREFIX: "Demo deploy failed",
        DEPLOYMENTS_NOTE: "Deployments expire per Railbound demo TTL; see https://railbound.io for details."
  } as const;
}