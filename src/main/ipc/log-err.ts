import { ipcMain } from 'electron';
import { LogErrChannel } from '../channels';

export default (logErr: (err: any) => void) => {
  ipcMain.on(LogErrChannel, async (_, err: any) => {
    logErr(err);
  });
};
