import { useEffect, useState } from 'react';
import { TFunction, WithTranslation, withTranslation } from 'react-i18next';
import RefreshButton from 'renderer/components/RefreshButton';
import Platform from 'renderer/components/Platform';
import Select from 'react-select';

import i18next from '../i18n';

import '../css/Index.css';

interface Props {
  t: TFunction<'translation', undefined>;
}

const Index: React.FC<WithTranslation> = ({ t }: Props) => {
  const languages = i18next.languages.map((language) => ({
    value: language,
    label: language,
  }));

  const [isRemote, setIsRemote] = useState(false);
  const [platform, setPlatform] = useState('');
  const [address, setAddress] = useState('');

  const onButtonClick = () => {
    window.electron.ipcRenderer.sendMessage('rdp-test', []);
    window.electron.ipcRenderer.sendMessage('host-ip', []);
  };

  useEffect(() => {
    // Request update once on load
    window.electron.ipcRenderer.sendMessage('rdp-test', []);

    // Listen for responses
    window.electron.ipcRenderer.on('rdp-test', (data) => {
      const values = JSON.parse(String(data));

      setIsRemote(values.isRdp);
      setPlatform(values.platform);
    });

    window.electron.ipcRenderer.on('host-ip', (data) => {
      const values = JSON.parse(String(data));

      setAddress(values.ip);
    });
  }, []);

  return (
    <div className="index">
      <header>
        <RefreshButton onClick={onButtonClick} />

        <Select
          defaultValue={languages[0]}
          options={languages}
          onChange={(value) =>
            i18next.changeLanguage(value?.value || i18next.language)
          }
        />

        <p>
          <strong>{t('Session')}:</strong> {isRemote ? t('remote') : t('local')}
        </p>

        <Platform platform={platform} remSize={2.375} />
      </header>

      <main>
        <h2>{t('IP address')}</h2>
        <h1>{address}</h1>
      </main>
    </div>
  );
};

export default withTranslation()(Index);
