import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import { globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import globals from 'globals'
import pluginPrettier from 'eslint-plugin-prettier'
export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElLoading: 'readonly',
      },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    plugins: {
      prettier: pluginPrettier,
    },
    // 自定义规则
    rules: {
      'prettier/prettier': ['warn', { usePrettierrc: true }],
      //  Vue 组件命名需遵循多单词命名规则，'warn'表示当违反此规则时给出警告提示
      // { ignores: ['index'] }表示名为index的组件可忽略此规则检查
      'vue/multi-word-component-names': ['warn', { ignores: ['Index'] }],
      'vue/no-setup-props-destructure': 'off',
    },
  }
)
