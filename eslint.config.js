import js from "@eslint/js"
import globals from "globals"
import pluginVue from "eslint-plugin-vue"
import json from "@eslint/json"
import css from "@eslint/css"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      // 1. 代码缩进（2空格）
      "indent": ["error", 2, { 
        "SwitchCase": 1,      // switch case 缩进规则
        "ignoredNodes": ["TemplateLiteral"] // 忽略模板字符串缩进
      }],
      
      // 2. 空白行规则
      "padding-line-between-statements": [
        "error",
        // 在 return 前加空行
        { "blankLine": "always", "prev": "*", "next": "return" },
        // 在函数声明前加空行
        { "blankLine": "always", "prev": "*", "next": "function" },
        // 在类声明前加空行
        { "blankLine": "always", "prev": "*", "next": "class" },
        // 块级作用域后加空行
        { "blankLine": "always", "prev": "block-like", "next": "*" }
      ],
      
      // 其他规则
      "semi": ["error", "never"] // 无分号
    }
  },
  pluginVue.configs["flat/essential"],
  { 
    files: ["**/*.json"], 
    plugins: { json }, 
    language: "json/json", 
    extends: ["json/recommended"] 
  },
  { 
    files: ["**/*.css"], 
    plugins: { css }, 
    language: "css/css", 
    extends: ["css/recommended"] 
  }
])