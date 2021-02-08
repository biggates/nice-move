#!/usr/bin/env node

const { ESLint } = require('eslint');
const pickBy = require('lodash/pickBy');
const sortKeys = require('sort-keys');
const writeJsonFile = require('write-json-file');
const printConfig = require('stylelint/lib/printConfig.js');

function save(outputName, data) {
  return writeJsonFile(`.cache/${outputName}`, data, { indent: 2 }).catch(
    console.error,
  );
}

function eslintInspector(configName, filename, outputName = '') {
  const engine = new ESLint({
    useEslintrc: false,
    baseConfig: {
      root: true,
      extends: configName,
    },
  });

  return engine
    .calculateConfigForFile(filename)
    .then((data) => {
      // eslint-disable-next-line no-param-reassign
      data.rules = pickBy(data.rules, (item) => item[0] !== 'off');
      return sortKeys(data, { deep: true });
    })
    .then((data) => {
      if (outputName) {
        return save(outputName, data);
      }
      return data;
    });
}

function stylelintInspector(outputName) {
  printConfig({
    extends: '@nice-move/stylelint-config',
    files: ['abc.css'],
  })
    .then((data) => {
      // eslint-disable-next-line no-param-reassign
      data.rules = pickBy(data.rules, (item) => item !== null);
      const io = sortKeys(data, { deep: true });
      if (outputName) {
        return save(outputName, io);
      }
      return io;
    })
    .catch(console.error);
}

module.exports = {
  eslintInspector,
  stylelintInspector,
};

if (require.main.filename === __filename) {
  eslintInspector('@nice-move/base', 'sample.js', 'js.json');
  eslintInspector('@nice-move/base', 'sample.html', 'html.json');
  eslintInspector('@nice-move/base', 'sample.cjs', 'cjs.json');
  eslintInspector('@nice-move/base', 'sample.mjs', 'mjs.json');

  eslintInspector('@nice-move/vue', 'sample.vue', 'vue.json');
  eslintInspector('@nice-move/react', 'sample.jsx', 'jsx.json');

  eslintInspector('@nice-move/base', 'sample.md', 'md.json');
  eslintInspector('@nice-move/base', 'sample.md/o.js', 'md/js.json');
  eslintInspector('@nice-move/base', 'sample.md/o.cjs', 'md/cjs.json');
  eslintInspector('@nice-move/base', 'sample.md/o.node', 'md/node.json');
  eslintInspector('@nice-move/base', 'sample.md/o.mjs', 'md/mjs.json');

  eslintInspector('@nice-move/react', 'sample.md/o.jsx', 'md/jsx.json');
  eslintInspector('@nice-move/base', 'sample.md/o.vue', 'md/vue.json');

  stylelintInspector('css.json');
}