import { ipcMain } from 'electron';
import ip from 'ip';

export default () => {
  ipcMain.on('host-ip', async (event, _) => {
    event.reply('host-ip', JSON.stringify({ ip: ip.address() }));
  });
};
