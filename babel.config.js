<<<<<<< HEAD
module.exports = function(api) {
=======
module.exports = function (api) {
>>>>>>> main
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
<<<<<<< HEAD
      ['inline-dotenv'],
      'react-native-reanimated/plugin', // Deixe esse plugin sempre como o último
=======
      // Plugin do react-native-reanimated
      'react-native-reanimated/plugin',
      // Plugin do react-native-dotenv com suas opções
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
>>>>>>> main
    ],
  };
};
