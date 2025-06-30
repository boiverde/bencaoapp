module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Optional: Enable React Refresh for development
      process.env.NODE_ENV !== 'production' && 'react-refresh/babel',
      
      // Optimize bundle size by removing console statements in production
      process.env.NODE_ENV === 'production' && ['transform-remove-console', { exclude: ['error', 'warn'] }],
      
      // Reanimated plugin (if you're using react-native-reanimated)
      'react-native-reanimated/plugin',
    ].filter(Boolean),
  };
};