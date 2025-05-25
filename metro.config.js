const { getDefaultConfig } = require('expo/metro-config');

// Get the default Expo config
const config = getDefaultConfig(__dirname);

// Add proper module resolution
config.resolver.nodeModulesPaths = [__dirname];

// Ensure proper module resolution for TypeScript and assets
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ttf'];

// Configure TypeScript transformer
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-typescript-transformer')
};

module.exports = config;