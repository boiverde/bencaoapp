const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default Metro config
const defaultConfig = getDefaultConfig(__dirname);

// Merge with default config
module.exports = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    extraNodeModules: {
      // Only include essential modules that we know exist
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      '@supabase/supabase-js': path.resolve(__dirname, 'node_modules/@supabase/supabase-js'),
    },
    sourceExts: [
      ...defaultConfig.resolver.sourceExts,
      'mjs',
      'cjs'
    ]
  },
  // Use the default watcher configuration
  watchFolders: [__dirname]
};