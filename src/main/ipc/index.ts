import regiserRdpTestIPC from './rdp-test';
import registerHostIpIPC from './host-ip';
import registerPingIPC from './ping';

export default (logErr: (err: any) => void) => {
  regiserRdpTestIPC(logErr);
  registerHostIpIPC();
  registerPingIPC();
};
