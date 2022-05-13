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
    window.electron.ipcRenderer
      .isAlive(host.host)
      .then((result) => {
        if (result.address === host.host) {
          setHost({ host: host.host, status: result.isAlive });
        }

        return result;
      })
      .catch((err) => window.electron.ipcRenderer.logErr(err));
  }, [host]);

  /**
   * Update host status - will set host status to the provided status argument.
   *  If status arg was not provided then request status (ping) update.
   * @param status default status value.
   */
  const updateHost = (status?: boolean) => {
    if (status !== undefined) setHost({ host: host.host, status });
    else {
      window.electron.ipcRenderer
        .isAlive(host.host)
        .then((result) => {
          if (result.address === host.host) {
            setHost({ host: host.host, status: result.isAlive });
          }

          return result;
        })
        .catch((err) => window.electron.ipcRenderer.logErr(err));
    }
  };

  return [host, updateHost];
};

export default useHostStatus;
