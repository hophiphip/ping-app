import { ipcMain } from 'electron';
import ping from 'ping';

const net = require('net');

export default () => {
  ipcMain.on('ping', async (event, arg) => {
    // Try to ping all args
    const stats = await Promise.all(
      // Remove duplicates
      ([...new Set(arg)] as string[])
        // Remove non-IP address values
        .filter((address: string) => net.isIP(address))
        .map(
          async (
            address: string
          ): Promise<{ host: string; status: boolean }> => {
            const res = await ping.promise.probe(address);
            return {
              host: address,
              status: res.alive,
            };
          }
        )
    );

    event.reply('ping', JSON.stringify(stats));
  });
};
