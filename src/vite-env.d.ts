/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // أضف متغيرات بيئية أخرى إذا احتجت
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
