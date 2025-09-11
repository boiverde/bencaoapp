module.exports = function(api) {
  api.cache(true);

  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Enable React Refresh only in development
      isDev && 'react-refresh/babel',

      // Remove console logs in production
      isProd && ['transform-remove-console', { exclude: ['error', 'warn'] }],

      // Reanimated plugin must be last
      'react-native-reanimated/plugin',
    ].filter(Boolean), // Filter out any falsey values from the plugins array
  };
};