module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:jsdoc/recommended",
    "google",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  rules: {
    "jsdoc/newline-after-description": "off",
    "jsdoc/require-jsdoc": ["warn", { publicOnly: true }],
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "prettier/prettier": "error",
    "require-atomic-updates": "off", // This rule is so noisy and isn't useful: https://github.com/eslint/eslint/issues/11899
    "require-jsdoc": "off", // This rule is deprecated and superseded by jsdoc/require-jsdoc.
    "valid-jsdoc": "off", // This is deprecated but included in recommended configs.

    "no-prototype-builtins": "warn", // TODO: remove, allow to error.
    "no-useless-escape": "warn", // TODO: remove, allow to error.
    "prefer-promise-reject-errors": "warn", // TODO: remove, allow to error.
  },
  overrides: [
    {
      files: ["*.ts"],
      rules: {
        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns-type": "off",
        "no-invalid-this": "off", // Turned off in favor of @typescript-eslint/no-invalid-this.
        "@typescript-eslint/no-invalid-this": ["error"],

        "@typescript-eslint/camelcase": "off", // TODO: remove, allow to error.
        "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }], // TODO: SET to error.
        "@typescript-eslint/no-inferrable-types": "warn", // TODO: remove, allow to error.
        "@typescript-eslint/no-misused-promises": "warn", // TODO: remove, allow to error.
        "@typescript-eslint/no-unnecessary-type-assertion": "warn", // TODO: remove, allow to error.
        "@typescript-eslint/no-use-before-define": ["warn", { functions: false, typedefs: false }], // TODO: change to error.
        "@typescript-eslint/no-var-requires": "warn", // TODO: remove, allow to error.
        "@typescript-eslint/prefer-includes": "warn", // TODO: remove, allow to error.
        "@typescript-eslint/prefer-regexp-exec": "warn", // TODO: remove, allow to error.
        "@typescript-eslint/prefer-string-starts-ends-with": "warn", // TODO: remove, allow to error.
        camelcase: "warn", // TODO: remove, allow to error.
        "no-case-declarations": "warn", // TODO: remove, allow to error.
        "no-constant-condition": "warn", // TODO: remove, allow to error.
        "no-fallthrough": "warn", // TODO: remove, allow to error.
      },
    },
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-this-alias": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/prefer-includes": "off",
        "@typescript-eslint/prefer-regexp-exec": "off",
        "@typescript-eslint/unbound-method": "off",

        "no-var": "off", // TODO: remove, allow to error.
        "prefer-arrow-callback": "off", // TODO: remove, allow to error.
      },
    },
    {
      files: ["*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
  parserOptions: {
    ecmaVersion: "2020",
    project: ["tsconfig.json"],
    sourceType: "module",
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ["prettier", "@typescript-eslint", "jsdoc"],
  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: "return",
      },
    },
  },
  parser: "@typescript-eslint/parser",
};