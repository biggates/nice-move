const { Text } = require('fs-chain');
const { cyan } = require('chalk');

const { pkgCwd } = require('../lib/utils.cjs');

module.exports = function Readme() {
  const { name, description } = pkgCwd();

  return new Text()
    .source('~README.md')
    .handle((text) => {
      if (text.trim()) {
        throw new Error('skip');
      }
      return [`# ${name}`, description ? `${description}.\n` : '']
        .filter(Boolean)
        .join('\n\n');
    })
    .output()
    .logger('Create', cyan('README.md'))
    .catch(console.warn);
};