/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY: string;
  readonly GITHUB_TOKEN?: string;
  readonly PUBLIC_GITHUB_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.png" {
  const value: {
    src: string;
    width: number;
    height: number;
    format: string;
  };
  export default value;
}

declare module "*.jpg" {
  const value: {
    src: string;
    width: number;
    height: number;
    format: string;
  };
  export default value;
}

declare module "*.jpeg" {
  const value: {
    src: string;
    width: number;
    height: number;
    format: string;
  };
  export default value;
}
