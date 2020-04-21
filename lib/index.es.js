import { declare } from '@babel/helper-plugin-utils';
import { readFileSync } from 'fs';
import { parse } from 'fast-xml-parser';
import pluginTransformTypeScript from '@babel/plugin-transform-typescript';
import presetTypeScript from '@babel/preset-typescript';

var index = declare((api, {
  jsxPragma,
  allExtensions = false,
  isTSX = false
}) => {
  api.assertVersion(7);
  return {
    "presets": [[presetTypeScript, {
      jsxPragma,
      allExtensions,
      isTSX
    }]],
    "overrides": [{
      "test": filePath => {
        if (/\.vue$/.test(filePath)) {
          const json = parse(readFileSync(filePath, {
            encoding: "utf8"
          }), {
            ignoreAttributes: false
          });

          if (json.script && typeof json.script === "object" && typeof json.script["@_lang"] === "string" && json.script["@_lang"].toLowerCase() === "ts") {
            return true;
          }
        }

        return false;
      },
      "plugins": [[pluginTransformTypeScript, {
        jsxPragma,
        allExtensions,
        isTSX
      }]]
    }]
  };
});

export default index;
