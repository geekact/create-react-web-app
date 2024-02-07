import { defineConfig } from 'vite-react';
import autoprefixer from 'autoprefixer';
{#px2rem_import#}

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        {#px2rem#}
      ],
    },
  },
});
