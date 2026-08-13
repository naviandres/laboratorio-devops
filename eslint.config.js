// Configuración ESLint 9 (flat config) para la app Express del laboratorio.
// - Recomendaciones base de ESLint (@eslint/js).
// - server.js y este archivo se ejecutan en Node (CommonJS): globals de Node.
// - Los tests usan Jest: globals de Node + Jest (describe/test/expect).
// - Se ignoran node_modules/ (dependencias) y public/ (frontend estático).

const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        ignores: ['node_modules/', 'public/'],
    },
    js.configs.recommended,
    {
        files: ['server.js', 'eslint.config.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: globals.node,
        },
    },
    {
        files: ['test/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
    },
];
