import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin, type Connect } from "vite";

const root = dirname(fileURLToPath(import.meta.url));

/**
 * Serve `/gilded-utilities` the same way the deployed site does.
 *
 * Vite only resolves a directory to its index.html when the URL ends in a
 * slash, so the extension-less canonical URL 404s locally even though
 * `public/_redirects` handles it in production. This rewrites any extension-less
 * path that has a matching `<path>/index.html` on disk, keeping dev, preview and
 * production consistent.
 */
function cleanUrls(): Plugin {
  const middleware =
    (baseDir: string): Connect.NextHandleFunction =>
    (req, _res, next) => {
      const [path = "", query = ""] = (req.url ?? "").split("?");
      // Only bare paths: no trailing slash, no file extension.
      if (path.length > 1 && !path.endsWith("/") && !/\.[^/]+$/.test(path)) {
        const candidate = resolve(baseDir, `.${path}`, "index.html");
        // Guard against `..` escaping the served directory.
        if (candidate.startsWith(resolve(baseDir)) && existsSync(candidate)) {
          req.url = `${path}/index.html${query ? `?${query}` : ""}`;
        }
      }
      next();
    };

  return {
    name: "clean-urls",
    configureServer(server) {
      server.middlewares.use(middleware(root));
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware(join(root, "dist")));
    },
  };
}

// One entry per route:
//   index.html                   -> ademdev.xyz
//   gilded-utilities/index.html  -> ademdev.xyz/gilded-utilities
//   blockbay/index.html          -> ademdev.xyz/blockbay
// Adding an add-on page means adding its config, its index.html and one line here.
export default defineConfig({
  appType: "mpa",
  publicDir: "public",
  plugins: [cleanUrls()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
    rollupOptions: {
      input: {
        portfolio: fileURLToPath(new URL("./index.html", import.meta.url)),
        gilded: fileURLToPath(new URL("./gilded-utilities/index.html", import.meta.url)),
        blockbay: fileURLToPath(new URL("./blockbay/index.html", import.meta.url)),
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
