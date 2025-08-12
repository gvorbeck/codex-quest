import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      "**/build/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/*.min.js",
      "**/coverage/**",
      "**/package-lock.json",
      "**/tsconfig*.json",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/no-unescaped-entities": "off", // Allow quotes and apostrophes in JSX text
      "react/prop-types": "off", // Not needed with TypeScript
      "@typescript-eslint/no-explicit-any": "warn", // Downgrade to warning
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
