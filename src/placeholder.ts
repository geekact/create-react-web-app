import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const additionalDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'additional');

export const placeholder = {
  foca: {
    foca_provider_import: "import { FocaProvider } from 'foca';",
    foca_provider_tag_start: '<FocaProvider>',
    foca_provider_tag_end: '</FocaProvider>',
  },
  antd: {
    antd_provider_import: `
import { ConfigProvider } from 'antd';
import antdZH from 'antd/es/locale/zh_CN';
`,
    antd_provider_tag_start: '<ConfigProvider  locale={antdZH}>',
    antd_provider_tag_end: '</ConfigProvider>',
  },
  normalizeCss: {
    normalize_css: "import 'normalize.css';",
  },
  requestManager(type: 'axios' | 'foca-axios') {
    return {
      axios_import:
        type === 'foca-axios'
          ? `import { type AxiosError, axios } from 'foca-axios';`
          : `import axios, { type AxiosError } from 'axios';`,
    };
  },
  project(name: string) {
    return {
      project_name: name,
    };
  },
  pxTransformer(type: 'px2rem', fontSize: number) {
    switch (type) {
      case 'px2rem':
        return {
          px2rem_import: `import px2rem from "postcss-pxtorem";`,
          px2rem: `px2rem({ mediaQuery: true, propList: ['*'], exclude: /node_modules/i }),`,
          px2rem_fontsize: `<script>
          (function () {
            var doc = document.documentElement;
            var pcFontSize = ${fontSize};
            var mobileFontSize = ${fontSize};
            var pcDesignWidth = 1920;
            var mobileDesignWidth = 375;
            var mobileMaxWidth = 960;

            var setBaseFontSize = function () {
                var clientWidth = window.innerWidth || doc.clientWidth;
                if (!clientWidth) return;
                doc.style.fontSize =
                  clientWidth > mobileMaxWidth
                    ? pcFontSize * (clientWidth / pcDesignWidth) + 'px'
                    : mobileFontSize * (clientWidth / mobileDesignWidth) + 'px';
              };
            if (!document.addEventListener) return;
            window.addEventListener(
              'orientationchange' in window ? 'orientationchange' : 'resize',
              setBaseFontSize,
              false,
            );
            document.addEventListener('DOMContentLoaded', setBaseFontSize, false);
          })();
          </script>`,
        };
      default:
        return;
    }
  },
  css_modules: {
    css_modules_extension: '"clinyong.vscode-css-modules",',
  },
  package_manager(manager: string) {
    return {
      package_manager_name: manager,
    };
  },
  commit: {
    commitlint_md: `
## 代码提交
请参考[社区规范](https://www.conventionalcommits.org/zh-hans)
    `,
    commitlint_config:
      ',"commintlint":' +
      JSON.stringify(
        {
          extends: ['@commitlint/config-conventional'],
        },
        null,
        2,
      ),
  },
  eslint(parsers: ('strict-ts' | 'check-file')[]) {
    let rules: Record<string, string> = {};
    const readRules = (filename: string) => {
      return (
        '  ' + readFileSync(path.join(additionalDir, filename), 'utf8').replaceAll('\n', '\n  ')
      );
    };

    if (parsers.includes('check-file')) {
      rules = {
        ...rules,
        check_file_parser: `  - 'check-file'`,
        check_file_rules: readRules('eslint-file-rules'),
      };
    }

    if (parsers.includes('strict-ts')) {
      rules = {
        ...rules,
        eslint_ts_rules: readRules('eslint-ts-rules'),
      };
    }

    return rules;
  },
};
