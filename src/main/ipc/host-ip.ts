import { ipcMain } from 'electron';
import ip from 'ip';
import { HostIpChannel, HostIpChannelSuccess } from '../channels';

export default () => {
  ipcMain.on(HostIpChannel, async (event, _) => {
    event.reply(HostIpChannelSuccess, ip.address());
  });
};
