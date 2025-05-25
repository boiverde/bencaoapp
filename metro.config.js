const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default Metro config
const config = getDefaultConfig(__dirname);

// Add proper module resolution
config.resolver.extraNodeModules = {
  // Core modules
  'react': path.resolve(__dirname, 'node_modules/react'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  'expo': path.resolve(__dirname, 'node_modules/expo'),
  'expo-router': path.resolve(__dirname, 'node_modules/expo-router'),
  '@supabase/supabase-js': path.resolve(__dirname, 'node_modules/@supabase/supabase-js'),
  '@': path.resolve(__dirname),
};

// Add web extensions
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'mjs',
  'cjs',
  'web.js',
  'web.jsx',
  'web.ts',
  'web.tsx'
];

// Ensure web platform is properly handled
config.resolver.platforms = ['ios', 'android', 'web'];

// Add watchFolders to include project root
config.watchFolders = [path.resolve(__dirname)];

module.exports = config;