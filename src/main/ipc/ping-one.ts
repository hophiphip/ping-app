import { ipcMain } from 'electron';
import ping from 'ping';
import net from 'net';
import { PingOneChannel, PingOneChannelSuccess } from '../channels';
import PingResult from '../../shared/PingResult';

/**
 * Register an IPC listener for testing remote host availability via ICMP request.
 */
export default () => {
  ipcMain.on(PingOneChannel, async (event, address: string) => {
    let status = false;

    if (net.isIP(address)) {
      const response = await ping.promise.probe(address);
      status = response.alive;
    }

    const result: PingResult = {
      address,
      isAlive: status,
    };

    event.reply(PingOneChannelSuccess, result);
  });
};
