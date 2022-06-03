import { ipcMain } from 'electron';
import { LogErrChannel } from '../channels';

/**
 * Register an IPC listener for logging error/message to the remote logging server.
 */
export default (logErr: (err: any) => void) => {
  ipcMain.on(LogErrChannel, async (_, err: any) => {
    logErr(err);
  });
};
