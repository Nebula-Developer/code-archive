import tailwindcss from "@tailwindcss/vite";
import vikeSolid from "vike-solid/vite";
import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";
import vike from "vike/plugin";
import path from "node:path";

export default defineConfig({
  plugins: [
    vike(),
    devServer({
      entry: "server/hono/hono-entry.ts",

      exclude: [
        /^\/@.+$/,
        /.*\.(ts|tsx|vue)($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /^\/favicon\.ico$/,
        /.*\.(svg|png)($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],

      injectClientScript: false,
    }),
    vikeSolid(),
    tailwindcss(),
  ],
  build: {
    target: "es2022",
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "components"),
      "@db": path.resolve(__dirname, "database"),
      "@rpc": path.resolve(__dirname, "trpc"),
      "@server": path.resolve(__dirname, "server"),
      "@layouts": path.resolve(__dirname, "layouts"),
      "@pages": path.resolve(__dirname, "pages"),
      "@assets": path.resolve(__dirname, "assets"),
    },
  },
});
