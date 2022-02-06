// https://github.com/yevhenlv/remove-strict-webpack-plugin/tree/patch-1
// https://github.com/hendrysadrak/remove-strict-webpack-plugin

const { sources, Compilation } = require('webpack');

class RemoveStrictPlugin {
  apply(compiler) {
    compiler.hooks.make.tap('RemoveStrictPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'Replace',
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        () => {
          Object.keys(compilation.assets).forEach((key) => {
            const file = compilation.getAsset(key);
            const source = file.source.source();
            const updatedSource =
              typeof source === 'string'
                ? source.replace(/"use strict";\n/gm, ';\n')
                : source;
            compilation.updateAsset(key, new sources.RawSource(updatedSource));
          });
        }
      );
    });
  }
}

module.exports = RemoveStrictPlugin;
