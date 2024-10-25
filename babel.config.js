module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Plugin do react-native-dotenv com suas opções
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
      // Plugin do react-native-reanimated
      'react-native-reanimated/plugin', // Deixe esse plugin sempre como o último 
    ],
  };
};
