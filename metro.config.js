// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for importing from outside the app directory
config.watchFolders = [path.resolve(__dirname, '..')];

// Add support for importing from node_modules
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

// Optimize bundle size by excluding dev-only modules in production
if (process.env.NODE_ENV === 'production') {
  config.resolver.blacklistRE = /\.dev\.(js|jsx|ts|tsx)$/;
}

// Enable minification in production
if (process.env.NODE_ENV === 'production') {
  config.transformer.minifierConfig = {
    compress: {
      drop_console: true,
      drop_debugger: true,
      global_defs: {
        __DEV__: false,
      },
    },
  };
}

// Add support for SVG files
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;