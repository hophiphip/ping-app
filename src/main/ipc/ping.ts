import { ipcMain } from 'electron';
import ping from 'ping';

export default () => {
  ipcMain.on('ping', async (event, arg) => {
    // Try-ping all args
    const stats = await Promise.all(
      arg.map(
        async (address: string): Promise<{ host: string; status: boolean }> => {
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
