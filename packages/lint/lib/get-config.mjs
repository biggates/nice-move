import { resolve } from 'path';
import { fileURLToPath } from 'url';

function parse(obj) {
  const io = Object.entries(obj)
    .map(([key, value]) => [key, value.filter(Boolean)])
    .filter(([_, value]) => value.length);

  return io.length > 0 ? Object.fromEntries(io) : undefined;
}

export function getConfig({
  rustywind,
  garou,
  stylelint,
  eslint,
  prettier,
  typescript,
}) {
  const useColor = process.stdin.isTTY ? ' --color' : '';

  const yarnConfig = resolve(fileURLToPath(import.meta.url), '../yarn.cjs');

  return parse({
    '*.{{wx,tt,q,ax,jx,ks}ml,swan}': [rustywind && 'rustywind --write'],
    '{ts,js,project.,project.private.}config.json': [garou && 'garou'],
    '*.{vue,html,htm}': [
      rustywind && 'rustywind --write',
      garou && 'garou',
      prettier && `prettier --write${useColor}`,
      stylelint &&
        `stylelint --fix --custom-formatter=node_modules/stylelint-formatter-pretty${useColor}`,
      eslint && `eslint --fix --format=pretty${useColor}`,
    ],
    '*.{ts,tsx}': [
      typescript && garou && 'garou',
      rustywind && 'rustywind --write',
      prettier && `prettier --write${useColor}`,
    ],
    '*.{js,jsx,mjs,cjs,wxs,qs,md}': [
      rustywind && 'rustywind --write',
      garou && 'garou',
      prettier && `prettier --write${useColor}`,
      eslint && `eslint --fix --format=pretty${useColor}`,
    ],
    '*.{c,sc,le,wx,q,tt,jx,ac}ss': [
      garou && 'garou',
      prettier && `prettier --write${useColor}`,
      stylelint &&
        `stylelint --fix --custom-formatter=node_modules/stylelint-formatter-pretty${useColor}`,
    ],
    '{*.{json,svg},*.{to,y,ya}ml,.{babel,npm}rc,.editorconfig}': [
      prettier && `prettier --write${useColor}`,
    ],
    'yarn.lock': [
      'yarn-deduplicate',
      `replace-in-file --configFile="${yarnConfig}"`,
    ],
  });
}
