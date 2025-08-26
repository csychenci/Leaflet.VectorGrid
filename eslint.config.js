import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        
        // Leaflet globals
        L: 'readonly',
        
        // Web Worker globals
        self: 'readonly',
        importScripts: 'readonly',
        postMessage: 'readonly',
        onmessage: 'writable'
      }
    },
    rules: {
      // 基础规则
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-console': 'off',
      'no-debugger': 'warn',
      
      // 代码风格
      'indent': ['error', 'tab'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      
      // ES6+ 规则
      'prefer-const': 'error',
      'no-var': 'error',
      'arrow-spacing': 'error',
      'template-curly-spacing': 'error'
    }
  },
  {
    // Web Worker 特定配置
    files: ['**/slicerWebWorker.js'],
    languageOptions: {
      globals: {
        self: 'readonly',
        importScripts: 'readonly',
        postMessage: 'readonly',
        onmessage: 'writable',
        geojsonvt: 'readonly',
        topojson: 'readonly'
      }
    }
  },
  {
    // 忽略构建输出和依赖
    ignores: [
      'dist/**',
      'node_modules/**',
      'docs/**/*.js',
      '*.min.js'
    ]
  }
];