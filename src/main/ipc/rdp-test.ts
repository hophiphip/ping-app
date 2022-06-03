import { ipcMain } from 'electron';
import RdpTestResult from '../../shared/RdpTestResult';
import { RdpTestChannel, RdpTestChannelSuccess } from '../channels';
import { isRdp } from '../utils/rdp-test';

/**
 * Register an IPC listener for testing OS remote services status (RDP, e.t.c.).
 */
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
