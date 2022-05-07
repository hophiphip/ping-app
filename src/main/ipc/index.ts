import regiserRdpTestIPC from './rdp-test';
import registerHostIpIPC from './host-ip';
import registerPingIPC from './ping';

export default () => {
  regiserRdpTestIPC();
  registerHostIpIPC();
  registerPingIPC();
};
