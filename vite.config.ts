import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { createBlockletPlugin } from 'vite-plugin-blocklet';
import { viteExternalsPlugin } from 'vite-plugin-externals'

// docs: https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const envMap = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      viteExternalsPlugin({
        react: 'React',
        'react-dom': 'ReactDOM',
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: envMap.APP_TITLE,
          },
        },
      }),
      createBlockletPlugin(),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: '',
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, './src'),
        },
      ],
    },
  };
});
