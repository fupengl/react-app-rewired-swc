const fs = require('fs');
const path = require('path');
const { paths } = require('react-app-rewired');

module.exports = rewiredSWC;

/**
 * replace babel to swc
 * @link https://github.com/swc-project/swc
 * @param swcLoaderOptions
 * @return {function(*, *): *}
 */
function rewiredSWC({ swcLoaderOptions } = {}) {
  return function (config) {
    const useTypeScript = fs.existsSync(paths.appTsConfig);
    const appSwcConfig = path.resolve(paths.appPath, '.swcrc');
    const useSwcConfig = fs.existsSync(appSwcConfig);
    const isDevelopment = process.env.BABEL_ENV !== "production"
    const isFastRefresh = process.env.FAST_REFRESH !== "false";

    // replace babel-loader to swc-loader
    for (const { oneOf } of config.module.rules) {
      if (oneOf) {
        let babelLoaderIndex = -1;
        const rules = Object.entries(oneOf);
        for (const [index, rule] of rules.slice().reverse()) {
          if (rule.loader && rule.loader.includes(path.sep + 'babel-loader' + path.sep)) {
            oneOf.splice(index, 1);
            babelLoaderIndex = index;
          }
        }
        if (~babelLoaderIndex) {
          oneOf.splice(babelLoaderIndex, 0, {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: [paths.appSrc],
            loader: require.resolve('swc-loader'),
            options: swcLoaderOptions || useSwcConfig ? undefined : {
              jsc: {
                target: 'es2015',
                externalHelpers: true,
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDevelopment,
                    refresh: isDevelopment && isFastRefresh,
                  },
                },
                parser: useTypeScript
                  ? {
                    syntax: 'typescript',
                    tsx: true,
                    decorators: true,
                    dynamicImport: true,
                  }
                  : {
                    syntax: 'ecmascript',
                    jsx: true,
                    dynamicImport: true,
                  },
              },
            },
          });
        }
      }
    }

    return config;
  };
}
