module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "airbnb",
        "airbnb-typescript",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "tsconfig.json",
    },
    "ignorePatterns": [
        ".eslintrc.js",
        "webpack.config.js",
    ],
    "plugins": [
        "react"
    ],
    "rules": {
        "react/function-component-definition": [
            2,
            { "namedComponents": "arrow-function" }
        ],
        "react/require-default-props": [
            "error",
            {
                "forbidDefaultForRequired": true,
                "functions": "defaultArguments"
            }
        ]
    }
}
