/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly TINYMCE_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
