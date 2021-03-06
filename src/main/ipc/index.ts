import regiserRdpTestIPC from './rdp-test';
import registerHostIpIPC from './host-ip';
import registerPingIPC from './ping';
import registerPingOneIPC from './ping-one';
import registerLogErrIPC from './log-err';
import registerTriggerNotification from './trigger-notification';

/**
 * Register all IPC event listeners.
 */
export default (logErr: (err: any) => void) => {
  regiserRdpTestIPC(logErr);
  registerHostIpIPC();
  registerPingIPC();
  registerPingOneIPC();
  registerLogErrIPC(logErr);
  registerTriggerNotification();
};
