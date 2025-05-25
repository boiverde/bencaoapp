const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default config
const config = getDefaultConfig(__dirname);

// Add custom config
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
};

// Ensure proper module resolution
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

// Add watchFolders to include project root
config.watchFolders = [path.resolve(__dirname)];

module.exports = config;