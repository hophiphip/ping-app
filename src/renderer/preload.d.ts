import { ContextBridgeApi } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: ContextBridgeApi;
    };
  }
}

export {};
