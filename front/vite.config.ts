import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    server: {
        host: true,
        port: Number(process.env.VITE_PORT),
        allowedHosts: ['localhost', 'app.adonis-svelte-starter-kit.fr'],
    },
    plugins: [sveltekit(), tailwindcss()],
});
