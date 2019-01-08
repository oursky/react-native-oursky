import typescript from "rollup-plugin-typescript";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import copy from "rollup-plugin-copy-assets";
import pkg from "./package.json";

const deps = Object.keys(pkg.dependencies || {});
const peerDeps = Object.keys(pkg.peerDependencies || {});
const allDeps = deps.concat(peerDeps);

const extensions = [".mjs", ".js", ".jsx", ".ts", ".tsx"];

const plugins = [
  resolve({
    extensions,
  }),
  json({
    preferConst: true,
    indent: "  ",
  }),
  commonjs({
    include: "node_modules/**",
  }),
  typescript(),
  copy({
    assets: ["./src/images"],
  }),
];

const output = [
  {
    format: "cjs",
    file: "dist/index.cjs.js",
    interop: true,
  },
];

function external(id) {
  if (id === "tslib") {
    return false;
  }
  for (const d of allDeps) {
    if (id.startsWith(d)) {
      return true;
    }
  }
  return false;
}

export default {
  input: "src/index.tsx",
  external,
  plugins,
  output,
};
