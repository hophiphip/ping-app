import { useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import '../css/Index.css';

const Index: React.FC<WithTranslation> = ({ t }) => {
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
      <button onClick={onButtonClick}>{t('Update button')}</button>
      <p><strong>{t('Timestamp')}:</strong> {timestamp}</p>
      <p><strong>{t('Platform')}:</strong> {platform}</p>
      <p><strong>{t('Session')}:</strong> {isRemote ? t('remote') : t('local')}</p>
    </div>
  );
};

export default withTranslation()(Index);
