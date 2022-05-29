# react-app-rewired-swc

Use `swc` in your `create-react-app`.

`react-scripts` When the project grows, the compilation speed is slow, and the development uses `swc` to improve the compilation speed.

> It is recommended to use the development mode to ensure stability !!!

## Features

- Relpace `babel-loader` to `swc-loader` for faster build time

## Installation

```bash
npm i react-app-rewired-swc -D
```

## Usage

This project is based on [`react-app-rewired`](https://github.com/timarney/react-app-rewired).

```js
/* config-overrides.js */

const rewiredSWC = require("eact-app-rewired-swc");

module.exports = function override(config, env) {
  // your config ...
  return rewiredSWC()(config, env);
};

// use `customize-cra`
const { override } = require("customize-cra");

module.exports = override(rewiredSWC());
```

## Options

specification [`swc-loader`](https://swc.rs/docs/usage/swc-loader)

### swcLoaderOptions

Type: `object`

## FQA

### Why is it faster?

Originally, create-react-app was compiled with babel, and [swc](https://github.com/swc-project/swc) would be faster to compile

## License

MIT © [fupengl](https://github.com/fupengl)
