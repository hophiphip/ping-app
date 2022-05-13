import { useEffect, useState } from 'react';

const useIsRemote = () => {
  const [isRemote, setIsRemote] = useState(false);

  const updateIsRemote = () => {
    window.electron.ipcRenderer
      .isRdp()
      .then((result) => {
        setIsRemote(result.isRdp);
        return result;
      })
      .catch((err) => window.electron.ipcRenderer.logErr(err));
  };

  useEffect(() => {
    updateIsRemote();
  }, [isRemote]);

  return [isRemote, updateIsRemote];
};

export default useIsRemote;
