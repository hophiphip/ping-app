import { ipcMain } from 'electron';
import ping from 'ping';
import { PingChannel, PingChannelSuccess } from '../channels';
import PingResult from '../../shared/PingResult';

const net = require('net');

export default () => {
  ipcMain.on(PingChannel, async (event, addresses: string[]) => {
    // Try to ping all args
    const results: PingResult[] = await Promise.all(
      // Remove duplicates
      ([...new Set(addresses)] as string[])
        // Remove non-IP address values
        .filter((address: string) => net.isIP(address))
        .map(async (address: string): Promise<PingResult> => {
          const res = await ping.promise.probe(address);
          return {
            address,
            isAlive: res.alive,
          };
        })
    );

    event.reply(PingChannelSuccess, results);
  });
};
