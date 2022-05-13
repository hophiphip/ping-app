import { useState, useEffect } from 'react';
import Host from '../models/Host';

/**
 * Returns a stateful value representing host model.
 * @param address IP address.
 * @returns
 */
const useHostStatus = (address: string) => {
  const [host, setHost] = useState<Host>({ host: address, status: false });

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('ping-one', [host.host]);

    window.electron.ipcRenderer.on('ping-one', (data) => {
      const response = JSON.parse(String(data)) as Host;

      if (response.host === host.host) {
        setHost(response);
      }
    });
  }, [host]);

  /**
   * Update host status - will set host status to the provided status argument.
   *  If status arg was not provided then request status (ping) update.
   * @param status default status value.
   */
  const updateHost = (status?: boolean) => {
    if (status !== undefined) setHost({ host: host.host, status });
    else {
      window.electron.ipcRenderer.sendMessage('ping-one', [host.host]);
    }
  };

  return [host, updateHost];
};

export default useHostStatus;