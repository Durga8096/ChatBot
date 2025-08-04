import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
 {
  "extends": "next",
  "rules": {
    "react/no-unescaped-entities": "off", // Disables this specific rule globally
    "@next/next/no-page-custom-font": "off"
  },
  "overrides": [
    {
      "files": ["pages/api/*.js"], // Apply rules only to API routes
      "rules": {
        "no-console": "off"
      }
    }
  ]
}
];

export default eslintConfig;
