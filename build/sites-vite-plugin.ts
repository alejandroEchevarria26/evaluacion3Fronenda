import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Plugin } from "vite";

export function sites(): Plugin {
  let projectRoot = process.cwd();

  return {
    name: "sites-artifact-manifest",
    apply: "build",
    configResolved(config) {
      projectRoot = config.root;
    },
    async closeBundle() {
      const source = resolve(projectRoot, ".openai/hosting.json");
      const destination = resolve(projectRoot, "dist/.openai/hosting.json");
      await mkdir(dirname(destination), { recursive: true });
      await copyFile(source, destination);
    },
  };
}
