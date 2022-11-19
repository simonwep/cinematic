import {defineConfig} from 'vite';
import banner from 'vite-plugin-banner';
import {name, version} from './package.json';

export default defineConfig((env) => ({
    root: env.command === 'serve' ? './demo' : undefined,

    plugins: [banner(`/*! ${name} ${version} MIT | https://github.com/Simonwep/cinematic */`)],

    build: {
        lib: {
            entry: './src/index.ts',
            name: 'cinematic',
            fileName: 'cinematic',
        },
    },

    server: {
        port: 3005,
    },

    define: {
        'import.meta.env.VERSION': JSON.stringify(version),
    },
}));
