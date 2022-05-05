import { useEffect, useState } from 'react';

import '../css/Index.css';

export default () => {
  const [isRemote, setIsRemote] = useState(false);
  const [platform, setPlatform] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const onButtonClick = () => {
    window.electron.ipcRenderer.sendMessage('rdp-test', []);
  }

  useEffect(() => {
    // Request update once on load
    window.electron.ipcRenderer.sendMessage('rdp-test', []);

    // Listen for responses
    window.electron.ipcRenderer.on('rdp-test', (data) => {
      const values = JSON.parse(String(data));

      setTimestamp(`${values.timestamp}`);
      setIsRemote(values.isRdp);
      setPlatform(values.platform);
    });
  }, []);

  return (
    <div>
      <button onClick={onButtonClick}>Request HOST status</button>
      <p><strong>Timestamp:</strong> {timestamp}</p>
      <p><strong>Platform:</strong> {platform}</p>
      <p><strong>Session:</strong> {isRemote ? 'remote' : 'local'}</p>
    </div>
  );
};
