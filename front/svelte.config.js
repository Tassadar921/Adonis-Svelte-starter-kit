import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
    preprocess: vitePreprocess(),
    kit: {
        env: {
            publicPrefix: 'PUBLIC_',
            privatePrefix: 'PRIVATE_',
        },
        adapter: adapter(),
        alias: {
            '#menu': './src/menu',
            '#components': './src/components',
            '#partials': './src/partials',
            '#services': './src/services',
            '#stores': './src/stores',
            '#pages': './src/pages',
            '#icons': './src/icons',
        },
    },
};

export default config;
