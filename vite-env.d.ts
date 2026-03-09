/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_UNSPLASH_ACCESS_KEY: string;
    // Add other environment variables here as needed
    // readonly VITE_ANOTHER_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
