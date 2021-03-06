import htmlBundle from "rollup-plugin-html-bundle";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "./src/ui.ts",
    output: {
      format: "iife",
      name: "ui",
      file: "src/build/bundle.js",
    },
    plugins: [
      typescript(),
      htmlBundle({
        template: "src/ui.html",
        target: "dist/ui.html",
        inline: true,
      }),
    ],
  },
  {
    input: "src/code.ts",
    output: {
      format: "cjs",
      name: "code",
      file: "dist/code.js",
    },
    plugins: [typescript()],
  },
];
