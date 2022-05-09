import { ipcMain } from 'electron';
import { isRdp } from '../utils/rdp-test';

export default (logErr: (err: any) => void) => {
  ipcMain.on('rdp-test', async (event, _) => {
    let isRdpSession = false;

    try {
      isRdpSession = isRdp();
    } catch (err) {
      logErr(err);
    }

    event.reply(
      'rdp-test',
      JSON.stringify({
        timestamp: Date.now(),
        platform: process.platform,
        isRdp: isRdpSession,
      })
    );
  });
};
