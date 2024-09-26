import { fileURLToPath } from 'node:url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { getPascalCaseRouteName, VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import VueDevTools from 'vite-plugin-vue-devtools'
import Layouts from 'vite-plugin-vue-layouts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Docs: https://github.com/posva/unplugin-vue-router#unplugin-vue-router
    VueRouter({
      getRouteName: (routeNode) => {
        // Convert pascal case to kebab case
        return getPascalCaseRouteName(routeNode)
          .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
          .toLowerCase()
      },
    }),

    // ⚠️ Vue must be placed after VueRouter()
    vue(),

    // Docs: https://devtools-next.vuejs.org/guide/vite-plugin
    VueDevTools(),

    // Docs: https://github.com/antfu/vite-plugin-vue-layouts
    Layouts({
      layoutsDirs: './src/layouts/',
    }),

    // Docs: https://github.com/antfu/unplugin-vue-components#unplugin-vue-components
    Components({
      dirs: ['src/components'],
      dts: true,
      resolvers: [
        (componentName) => {
          if (componentName === 'Primitive') {
            return { name: 'Primitive', from: 'radix-vue' }
          }
        },
      ],
    }),

    // Docs: https://github.com/antfu/unplugin-auto-import#unplugin-auto-import
    AutoImport({
      imports: [VueRouterAutoImports, '@vueuse/core', 'vue', 'vue-i18n', 'pinia'],
      dirs: ['./src/defaults/**'],
    }),

    // Docs: https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#intlifyunplugin-vue-i18n
    VueI18nPlugin({
      include: [
        fileURLToPath(new URL('./src/i18n/**', import.meta.url)),
      ],
    }),

    // Docs: https://vite-plugin-checker.netlify.app/introduction/getting-started.html
    checker({
      typescript: true,
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
    },
  },
  server: {
    port: 5177,
  },
})
