import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        alias: {
            '#components': './src/components',
            '#services': './src/services',
            '#stores': './src/stores',
            '#pages': './src/pages',
        },
    },
};

export default config;
