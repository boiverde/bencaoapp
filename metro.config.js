const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default Metro config
const defaultConfig = getDefaultConfig(__dirname);

// Add all additional extensions and asset types
const config = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    extraNodeModules: {
      '@': path.resolve(__dirname),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      '@supabase/supabase-js': path.resolve(__dirname, 'node_modules/@supabase/supabase-js'),
    },
    sourceExts: [
      ...defaultConfig.resolver.sourceExts,
      'mjs',
      'cjs',
      'jsx',
      'tsx',
      'ts',
    ],
    assetExts: [
      ...defaultConfig.resolver.assetExts,
      'png',
      'jpg',
      'jpeg',
      'gif',
      'webp',
    ],
    platforms: ['ios', 'android', 'web']
  },
  transformer: {
    ...defaultConfig.transformer,
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  watchFolders: [path.resolve(__dirname)],
  maxWorkers: 2
};

module.exports = config;