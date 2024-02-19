#!/usr/bin/env node

import inquirer from 'inquirer';
import { placeholder } from './placeholder';
import { ora, runCommand, runShell } from './run';
import path from 'path';
import { appendFile, mkdir, readFile, writeFile, cp } from 'fs/promises';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import chalk from 'chalk';

let usingVariables: Record<string, string> = {};
const additionFiles: string[] = [];

const appendVariables = (data: Record<string, string> | undefined) => {
  usingVariables = {
    ...usingVariables,
    ...data,
  };
};

const { project } = await inquirer.prompt<{ project: string }>({
  name: 'project',
  message: '根目录名称（创建文件夹）',
  default: 'react-app',
  validate(input) {
    return !!String(input).trim();
  },
  filter(input) {
    return String(input).trim();
  },
});
appendVariables(placeholder.project(path.basename(project)));

const { packageManager } = await inquirer.prompt<{ packageManager: 'pnpm' | 'yarn' | 'npm' }>({
  name: 'packageManager',
  message: '选择包管理工具',
  type: 'list',
  choices: ['pnpm', 'yarn', 'npm'],
});
appendVariables(placeholder.package_manager(packageManager));

const { stateManager } = await inquirer.prompt<{ stateManager: 'foca' | '' }>({
  name: 'stateManager',
  message: '状态管理库',
  type: 'list',
  choices: ['foca', { name: '不需要', value: '' }],
});
if (stateManager === 'foca') {
  appendVariables(placeholder.foca);
  additionFiles.push(path.join('src', 'models', '**/*'));
}

const { request } = await inquirer.prompt<{ request: 'axios' | 'foca-axios' }>({
  name: 'request',
  message: '请求库',
  type: 'list',
  choices: [
    {
      name: 'foca-axios (节流/重试/缓存）',
      value: 'foca-axios',
      short: 'foca-axios',
    },
    { name: 'axios', value: 'axios' },
    { name: '浏览器fetch即可', value: '' },
  ],
});
if (request) {
  appendVariables(placeholder.requestManager(request));
  additionFiles.push(path.join('src', 'services', 'http-client.ts'));
}

const { commitlint } = await inquirer.prompt<{ commitlint: boolean }>({
  name: 'commitlint',
  message: 'commit提交检测',
  type: 'list',
  choices: [
    { name: '要的', value: true },
    { name: '不要', value: false },
  ],
});
commitlint && appendVariables(placeholder.commit);

const { cssMode } = await inquirer.prompt<{ cssMode: 'css-modules' | '' }>({
  name: 'cssMode',
  message: 'CSS方案',
  type: 'list',
  choices: [
    { name: 'Css Modules', value: 'css-modules' },
    { name: '无', value: '' },
  ],
});
switch (cssMode) {
  case 'css-modules':
    appendVariables(placeholder.css_modules);
    break;
}

const { pxTransformer } = await inquirer.prompt<{
  pxTransformer: 'px2rem' | '';
}>({
  name: 'pxTransformer',
  message: '像素转换方式',
  type: 'list',
  choices: [
    { name: 'px -> rem （适合PC + h5）', short: 'px -> rem', value: 'px2rem' },
    { name: '无', value: '' },
  ],
});

if (pxTransformer) {
  const { fontSize } = await inquirer.prompt<{ fontSize: number }>({
    name: 'fontSize',
    message: '默认字体大小(px)',
    type: 'number',
    default: 16,
  });
  appendVariables(placeholder.pxTransformer(pxTransformer, fontSize));
}

let eslintParsers: ('strict-ts' | 'check-file')[] = [];
const { installEslint } = await inquirer.prompt<{ installEslint: boolean }>({
  name: 'installEslint',
  message: '安装Eslint相关插件',
  type: 'list',
  choices: [
    { name: '要的', value: true },
    { name: '不要', value: false },
  ],
});
if (installEslint) {
  eslintParsers = (
    await inquirer.prompt({
      name: 'eslintParsers',
      message: '建议的eslint规则',
      type: 'checkbox',
      choices: [
        { name: 'TS严格类型', value: 'strict-ts', checked: true },
        { name: '规范文件名', value: 'check-file', checked: true },
      ],
    })
  )['eslintParsers'];
  appendVariables(placeholder.eslint(eslintParsers));
}

const { ui } = await inquirer.prompt<{ ui: 'antd' | 'normalize.css' | '' }>({
  name: 'ui',
  message: 'UI框架',
  type: 'list',
  choices: [
    { name: 'Ant Design (后台管理系统必备）', value: 'antd', short: 'Ant Design' },
    {
      name: 'normalize.css（抹平浏览器差异）',
      value: 'normalize.css',
      short: 'normalize.css',
    },
    {
      name: '无',
      value: '',
    },
  ],
});
if (ui === 'antd') {
  appendVariables(placeholder.antd);
} else if (ui === 'normalize.css') {
  appendVariables(placeholder.normalizeCss);
}

console.log();
ora.info('开始生成定制模板');
console.log();

const rootDir = path.resolve(project);

await runCommand('创建目录', async () => {
  await mkdir(rootDir, { recursive: true });
  process.chdir(rootDir);
});

await runCommand('生成模板', async () => {
  const templateDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'template');
  const additionalDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'additional');
  const patterns = additionFiles
    .map((file) => path.join(additionalDir, file))
    .concat(path.join(templateDir, '**', '*'))
    .map((file) => file.replaceAll('\\', '/'));
  const files = await glob(patterns, { dot: true, nodir: true });

  await Promise.all(
    files.map(async (file) => {
      const relativePath = path.relative(
        file.includes('template') ? templateDir : additionalDir,
        file,
      );
      const destFile = path.resolve(relativePath);
      await mkdir(path.dirname(destFile), { recursive: true });

      if (['.png', '.jpg', '.jpeg'].includes(path.extname(file))) {
        await cp(file, destFile);
      } else {
        let content = await readFile(file, 'utf8');
        Object.entries(usingVariables).forEach(([key, value]) => {
          content = content.replaceAll(`{#${key}#}`, value);
        });
        content = content.replaceAll(/{#.+#}/g, '');
        await writeFile(destFile, content);
      }
    }),
  );
});

if ((await runShell('git -v')).stdout.includes('version')) {
  await runCommand('git初始化', async () => {
    await runShell('git init');
  });
}

if ((await runShell('volta -v')).stdout.match(/\d\.\d/)) {
  await runCommand('在package.json中配置volta', async () => {
    await runShell('volta pin node');
    if (packageManager !== 'npm') {
      await runShell(`volta pin ${packageManager}`);
    }
  });
}

await runCommand('安装通用npm包', async () => {
  await runShell(`${packageManager} add react react-dom react-router-dom`);
  await runShell(
    `${packageManager} add @types/node typescript prettier @types/react @types/react-dom -D`,
  );
});

if (commitlint) {
  await runCommand('安装commit相关插件', async () => {
    await runShell(
      `${packageManager} add husky @commitlint/cli @commitlint/config-conventional -D`,
    );
    await runShell(`npx husky init`);
    await writeFile(
      path.resolve('.husky/pre-commit'),
      `npx --no-install prettier --cache --check .`,
    );
    await writeFile(path.resolve('.husky', 'commit-msg'), 'npx --no-install commitlint --edit $1');
  });
}

await runCommand('安装vite相关插件', async () => {
  await runShell(`${packageManager} add vite vite-react autoprefixer -D`);
});

if (pxTransformer) {
  await runCommand('安装CSS像素转换插件', async () => {
    if (pxTransformer === 'px2rem') {
      await runShell(`${packageManager} add postcss-pxtorem @types/postcss-pxtorem -D`);
    }
  });
}

if (installEslint) {
  await runCommand('安装eslint相关插件', async () => {
    const pkgs = ['eslint', '@typescript-eslint/eslint-plugin', '@typescript-eslint/parser'];
    if (eslintParsers.includes('check-file')) {
      pkgs.push('eslint-plugin-check-file');
    }
    await runShell(`${packageManager} add eslint ${pkgs.join(' ')} -D`);

    if (commitlint) {
      await appendFile(
        path.resolve('.husky', 'pre-commit'),
        '\nnpx --no-install eslint --cache --ext .ts,.tsx src',
      );
    }
  });
}

if (stateManager) {
  await runCommand('安装状态管理库相关插件', async () => {
    if (stateManager === 'foca') {
      await runShell(`${packageManager} add foca redux-logger`);
      await runShell(`${packageManager} add @types/redux-logger -D`);
    }
  });
}

if (request) {
  await runCommand('安装请求库插件', async () => {
    await runShell(`${packageManager} add ${request}`);
  });
}

if (ui === 'antd') {
  await runCommand('安装antd插件', async () => {
    await runShell(`${packageManager} add antd @ant-design/icons`);
  });
} else if (ui === 'normalize.css') {
  await runCommand('安装normalize.css插件', async () => {
    await runShell(`${packageManager} add normalize.css`);
  });
}

await runCommand('使用prettier格式化模板', async () => {
  await runShell('npx prettier --write .');
});

console.log('项目已生成： ' + chalk.green(rootDir));
