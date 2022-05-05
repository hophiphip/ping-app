import { useEffect, useState } from 'react';

import '../css/Index.css';

export default () => {
  const [message, setMessage] = useState('[no message]');

  const onButtonClick = () => {
    window.electron.ipcRenderer.sendMessage('rdp-test', []);
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('rdp-test', (data) => {
      const values = JSON.parse(String(data));
      setMessage(`${values.platform}: [${values.timestamp}] ${values.isRdp ? 'rdp session' : 'desktop session'}`);
    });
  }, []);

  return (
    <div>
      <button onClick={onButtonClick}>Send IPC message</button>
      <p>{message}</p>
    </div>
  );
};