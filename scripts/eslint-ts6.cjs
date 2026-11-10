const Module = require("module");
const path = require("path");
const ts6 = require.resolve("@typescript/typescript6");
const originalResolve = Module._resolveFilename;

Module._resolveFilename = function (request, parent, isMain, options) {
  if (
    request === "typescript" &&
    typeof parent?.filename === "string" &&
    parent.filename.includes(`${path.sep}node_modules${path.sep}`)
  ) {
    return ts6;
  }

  return originalResolve.call(this, request, parent, isMain, options);
};
