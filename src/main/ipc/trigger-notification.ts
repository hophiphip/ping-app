import { ipcMain, Notification } from 'electron';
import { TriggerNotififcation } from '../channels';

/**
 * Register an IPC listener for triggering system notification.
 */
export default () => {
  ipcMain.on(TriggerNotififcation, async (_, title: string, body: string) => {
    new Notification({ title, body }).show();
  });
};
