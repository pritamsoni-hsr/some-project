// @ts-check
/**
 * @type {()=>import("@babel/core").TransformOptions|import("@babel/core").TransformOptions}
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['babel-plugin-inline-import', { extensions: ['.svg', '.png'] }],
      ['module-resolver', { alias: { '@app': './src','common': './src/common' } }],
      'react-native-reanimated/plugin',
    ],
  };
};
