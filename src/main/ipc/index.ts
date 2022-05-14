import regiserRdpTestIPC from './rdp-test';
import registerHostIpIPC from './host-ip';
import registerPingIPC from './ping';
import registerPingOneIPC from './ping-one';
import registerLogErrIPC from './log-err';

export default (logErr: (err: any) => void) => {
  regiserRdpTestIPC(logErr);
  registerHostIpIPC();
  registerPingIPC();
  registerPingOneIPC();
  registerLogErrIPC(logErr);
};
