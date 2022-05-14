import { useState, useCallback } from 'react';
import Host from '../models/Host';

/**
 * Returns a stateful value representing host model.
 * @param address IP address.
 * @returns
 */
const useHostStatus = (address: string) => {
  const [host, setHost] = useState<Host>({ host: address, status: false });

  const update = useCallback(
    (status?: boolean) => {
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
          .catch((err) => {
            window.electron.ipcRenderer.logErr(err);
          });
      }
    },
    [host]
  );

  return [host, update];
};

export default useHostStatus;
