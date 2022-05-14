import { useCallback, useState } from 'react';
import Session from '../models/Session';

const useSessionState = (): [Session, () => void] => {
  const [session, setSession] = useState<Session>({
    isRemote: false,
    platform: '',
    address: '',
  });

  const update = useCallback((): void => {
    Promise.all([
      window.electron.ipcRenderer.isRdp(),
      window.electron.ipcRenderer.hostIp(),
    ])
      .then((values) => {
        const [rdpTestResult, hostIp] = values;
        setSession({
          isRemote: rdpTestResult.isRdp,
          platform: rdpTestResult.platform,
          address: hostIp,
        });
        return values;
      })
      .catch((err) => {
        window.electron.ipcRenderer.logErr(err);
      });
  }, []);

  return [session, update];
};

export default useSessionState;
