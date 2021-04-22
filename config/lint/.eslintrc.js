module.exports = {
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  plugins: ['vue'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/order-in-components': ['error', {
      order: [
        'el',
        'name',
        'key',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        ['provide', 'inject'],
        'ROUTER_GUARDS',
        'layout',
        'middleware',
        'validate',
        'scrollToTop',
        'transition',
        'loading',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'emits',
        'setup',
        'asyncData',
        'data',
        'fetch',
        'head',
        'computed',
        'watch',
        'watchQuery',
        'LIFECYCLE_HOOKS',
        'methods',
        ['template', 'render'],
        'renderError'
      ]
    }],
    'vue/require-prop-types': 'error',
    'vue/require-default-prop': 'error',
    'vue/this-in-template': ['error', 'never'],
    'vue/html-self-closing': [
      'error', {
        html: {
          void: 'never',
          normal: 'never',
          component: 'never'
        },
        svg: 'never',
        math: 'never'
      }
    ]
  },
  overrides: [
    {
      files: [
        '**/?(*.)test.[jt]s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
