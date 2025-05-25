const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default Metro config
const config = getDefaultConfig(__dirname);

// Add proper module resolution
config.resolver.extraNodeModules = {
  // Ensure these core modules are available
  'react': path.resolve(__dirname, 'node_modules/react'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  'expo': path.resolve(__dirname, 'node_modules/expo'),
  'expo-router': path.resolve(__dirname, 'node_modules/expo-router'),
  '@': path.resolve(__dirname),
};

// Add any additional extensions needed for web
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Ensure web platform is properly handled
config.resolver.platforms = ['ios', 'android', 'web'];

module.exports = config;