import { useCallback, useState } from 'react';
import Host from 'renderer/models/Host';

interface Props {
  initial: Host[];
}

const useHostsStatuses = ({ initial }: Props) => {
  const [hosts, setHosts] = useState<Host[]>(initial);

  /**
   * Add another host to the list.
   * @param host a new host.
   */
  const addHost = useCallback((host: Host) => {
    setHosts((h) => [...h, host]);
  }, []);

  /**
   * Update all hosts statues at the same time.
   */
  const updateHostsSync = useCallback(() => {
    window.electron.ipcRenderer
      .isAliveAll(hosts.map((host) => host.host))
      .then((results) => {
        setHosts(
          results.map((result) => ({
            host: result.address,
            status: result.isAlive,
          }))
        );

        return results;
      })
      .catch((err) => {
        window.electron.ipcRenderer.logErr(err);
      });
  }, [hosts]);

  return { hosts, addHost, updateHostsSync };
};

export default useHostsStatuses;
