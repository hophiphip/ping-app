import { ipcMain } from 'electron';
import RdpTestResult from '../../shared/RdpTestResult';
import { RdpTestChannel, RdpTestChannelSuccess } from '../channels';
import { isRdp } from '../utils/rdp-test';

export default (logErr: (err: any) => void) => {
  ipcMain.on(RdpTestChannel, async (event, _) => {
    let isRdpSession = false;

    try {
      isRdpSession = isRdp();
    } catch (err) {
      logErr(err);
    }

    const rdpTestResult: RdpTestResult = {
      timestamp: Date.now(),
      platform: process.platform,
      isRdp: isRdpSession,
    };

    event.reply(RdpTestChannelSuccess, rdpTestResult);
  });
};
