module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          browsers: ['last 2 version'],
        },
        loose: true,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [['@babel/plugin-proposal-class-properties', {loose: true}]],
};
