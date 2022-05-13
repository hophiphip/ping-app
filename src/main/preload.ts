import { contextBridge, ipcRenderer } from 'electron';
import PingResult from '../shared/PingResult';
import RdpTestResult from '../shared/RdpTestResult';

import {
  RdpTestChannel,
  RdpTestChannelSuccess,
  HostIpChannel,
  HostIpChannelSuccess,
  PingOneChannel,
  PingChannelSuccess,
  PingChannel,
  PingOneChannelSuccess,
  LogErrChannel,
} from './channels';

export type ContextBridgeApi = {
  isRdp: () => Promise<RdpTestResult>;
  hostIp: () => Promise<string>;
  isAlive: (address: string) => Promise<PingResult>;
  isAliveAll: (addresses: string[]) => Promise<PingResult[]>;
  logErr: (err: any) => void;
};

const contextBridgeApi: ContextBridgeApi = {
  isRdp: () => {
    ipcRenderer.send(RdpTestChannel);
    return new Promise((resolve) => {
      ipcRenderer.once(RdpTestChannelSuccess, (_, data: RdpTestResult) =>
        resolve(data)
      );
    });
  },

  hostIp: () => {
    ipcRenderer.send(HostIpChannel);
    return new Promise((resolve) => {
      ipcRenderer.once(HostIpChannelSuccess, (_, data: string) =>
        resolve(data)
      );
    });
  },

  isAlive: (host: string) => {
    ipcRenderer.send(PingOneChannel, host);
    return new Promise((resolve) => {
      ipcRenderer.once(PingOneChannelSuccess, (_, data: PingResult) =>
        resolve(data)
      );
    });
  },

  isAliveAll: (hosts: string[]) => {
    ipcRenderer.send(PingChannel, hosts);
    return new Promise((resolve) => {
      ipcRenderer.once(PingChannelSuccess, (_, data: PingResult[]) =>
        resolve(data)
      );
    });
  },

  logErr: (err: any) => {
    ipcRenderer.send(LogErrChannel, err);
  },
};

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: contextBridgeApi,
});
