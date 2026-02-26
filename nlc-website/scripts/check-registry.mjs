#!/usr/bin/env node
import { execSync } from "node:child_process";

function run(cmd) {
  try {
    execSync(cmd, { stdio: "inherit" });
    return true;
  } catch {
    return false;
  }
}

console.log("Checking npm registry connectivity...");
const okPing = run("npm ping --loglevel error");
const okView = run("npm view react version --loglevel error");

if (!okPing || !okView) {
  console.error("\nRegistry check failed.");
  console.error("Likely cause: restricted network/proxy policy returning HTTP 403.");
  console.error("Fix options:");
  console.error("  1) Set an approved registry: NPM_CONFIG_REGISTRY=<your-internal-registry>");
  console.error("  2) Ensure proxy env vars are valid: HTTP_PROXY/HTTPS_PROXY/NO_PROXY");
  console.error("  3) Authenticate if your registry requires an auth token");
  process.exit(1);
}

console.log("Registry connectivity looks good.");
