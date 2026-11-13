module.exports = {
  customSyntax: 'postcss-scss',
  ignoreFiles: [
    'assets/styles/slick/**/*.scss',
  ],
  plugins: [
    'stylelint-scss',
  ],
  rules: {
    'declaration-block-no-duplicate-properties': [
      true,
      { ignore: ['consecutive-duplicates-with-different-values'] },
    ],
    'scss/at-rule-no-unknown': true,
  },
};
