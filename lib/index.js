'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var helperPluginUtils = require('@babel/helper-plugin-utils');
var fs = require('fs');
var fastXmlParser = require('fast-xml-parser');
var pluginTransformTypeScript = _interopDefault(require('@babel/plugin-transform-typescript'));
var presetTypeScript = _interopDefault(require('@babel/preset-typescript'));

var index = helperPluginUtils.declare((api, {
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
          const json = fastXmlParser.parse(fs.readFileSync(filePath, {
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

module.exports = index;
