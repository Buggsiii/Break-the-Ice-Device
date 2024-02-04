import { ElectronHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
  }
}

declare module '*.gltf' {
  const value: any;
  export default value;
}

export {};
