interface ImportMetaEnv {
    readonly VITE_PORT: number;
    readonly VITE_FRONT_URI: string;
    readonly VITE_API_BASE_URI: string;
    readonly VITE_GITHUB_REPOSITORY: string;
    readonly VITE_DEFAULT_IMAGE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
