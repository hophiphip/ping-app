import { ipcMain } from 'electron';
import ip from 'ip';
import { HostIpChannel, HostIpChannelSuccess } from '../channels';

/**
 * Register an IPC listener for accessing hosts ip address.
 */
export default () => {
  ipcMain.on(HostIpChannel, async (event, _) => {
    event.reply(HostIpChannelSuccess, ip.address());
  });
};
