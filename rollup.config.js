import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import autoPreprocess from "svelte-preprocess";
import visualizer from "rollup-plugin-visualizer";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import del from "del";
import strip from "@rollup/plugin-strip";
import { getReplaceObj, serve, setupEnv } from "./utils";
import pkg from "./package.json";
import path from "path";

const production = !process.env.ROLLUP_WATCH;
const env = production
  ? "production"
  : process.env.NODE_ENV
  ? process.env.NODE_ENV
  : "development";
setupEnv({ env });

del.sync("public");

function getOutputConfig(pkg, production) {
  function manualChunks(id) {
    if (id.includes("node_modules")) {
      return "vendor";
    }
  }

  let output = {
    format: "esm",
    dir: path.dirname(pkg.module),
    entryFileNames: "[name].mjs",
    chunkFileNames: "[name].mjs",
    sourcemap: !production,
    manualChunks,
  };

  if (production) {
    output = [
      output,
      {
        file: pkg.browser,
        format: "iife",
        name: "StrategyconGametable",
        sourcemap: !production,
        inlineDynamicImports: true,
      },
    ];
  }

  return output;
}

export default {
  input: "src/index.js",

  output: getOutputConfig(pkg, production),

  plugins: [
    postcss({
      sourceMap: !production,
      minimize: production,
      extract: "index.css",
    }),
    svelte({
      preprocess: autoPreprocess({
        postcss: true,
      }),

      emitCss: true,

      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,

        css: false,
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    replace(getReplaceObj({ env })),

    json(),

    copy({
      targets: (() => {
        const targets = [
          { src: "static/*", dest: "public" },
          // { src: 'node_modules/flag-icon-css/flags/4x3/**.svg', dest: 'public/flags' },
        ];

        if (!production) {
          targets.push({ src: "static-dev/*", dest: "public" });
        }

        return targets;
      })(),
    }),

    production && strip(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    !production &&
      visualizer({
        filename: "public/visualizer.html",
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  watch: {
    clearScreen: false,
  },
};
