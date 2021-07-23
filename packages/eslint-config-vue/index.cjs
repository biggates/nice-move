'use strict';

const { resolve } = require('path');

function isSafeError(error) {
  return (
    error.code === 'MODULE_NOT_FOUND' && error.requireStack[0] === __filename
  );
}

// eslint-disable-next-line consistent-return
function getVersion() {
  try {
    const { dependencies: { vue } = {} } = require(resolve(
      process.cwd(),
      'package.json',
    ));
    return vue;
  } catch (error) {
    if (!isSafeError(error)) {
      throw error;
    }
  }
}

const version = getVersion();

module.exports = {
  extends: ['@nice-move/eslint-config-base'],
  overrides: [
    {
      files: '*.vue',
      extends: ['plugin:vue/recommended', 'prettier'],
      parserOptions: {
        ecmaVersion: 2021,
      },
      rules: {
        'vue/attributes-order': 'off',
        'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
        'vue/no-duplicate-attr-inheritance': 'warn',
        'vue/no-empty-component-block': 'error',
        'vue/no-template-target-blank': ['error', { allowReferrer: true }],
        'vue/order-in-components': 'off',
        'vue/padding-line-between-blocks': 'warn',
        'vue/require-name-property': 'warn',
        'vue/v-on-function-call': ['warn', 'never'],
        'vue/no-useless-mustaches': [
          'warn',
          {
            ignoreIncludesComment: true,
            ignoreStringEscape: true,
          },
        ],
        'vue/no-reserved-component-names': [
          'error',
          {
            disallowVueBuiltInComponents: true,
            disallowVue3BuiltInComponents: true,
          },
        ],
        ...(version
          ? { 'vue/no-unsupported-features': ['error', { version }] }
          : undefined),
      },
    },
  ],
};
