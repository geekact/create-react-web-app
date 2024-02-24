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
  px2rem: {
    px2rem_import: `import px2rem from "postcss-pxtorem";`,
    px2rem: `px2rem({ mediaQuery: true, propList: ['*'], exclude: /node_modules/i }),`,
    px2rem_fontsize: `<script>
    (function () {
      var doc = document.documentElement;
      var pcFontSize = 16;
      var mobileFontSize = 16;
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
  },
  css_modules: {
    css_modules_extension: '"clinyong.vscode-css-modules",',
  },
  package_manager(manager: string) {
    return {
      package_manager_name: manager,
    };
  },
  eslint: {
    eslint_husky: 'npx --no-install eslint --cache --ext .ts,.tsx src',
  },
  stylelint: {
    stylelint_husky: 'npx --no-install stylelint --cache "**/*.scss"',
    stylelint_extension: `"stylelint.vscode-stylelint",`,
  },
  commitlint: {
    commitlint_md: `
## 代码提交
请参考[社区规范](https://www.conventionalcommits.org/zh-hans)
    `,
  },
};
