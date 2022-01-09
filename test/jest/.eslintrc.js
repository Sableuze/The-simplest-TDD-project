module.exports = {
  extends: [
    // Removes 'no-undef' lint errors for Jest global functions (`describe`, `it`, etc),
    //  add Jest-specific lint rules and Jest plugin
    // See https://github.com/jest-community/eslint-plugin-jest#recommended
    'plugin:jest/recommended',
    // Uncomment following line to apply style rules
    // 'plugin:jest/style',
  ],


  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-call': 0
  }
};
