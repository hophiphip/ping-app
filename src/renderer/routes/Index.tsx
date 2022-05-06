import { useEffect, useState } from 'react';
import { TFunction, WithTranslation, withTranslation } from 'react-i18next';
import RefreshButton from 'renderer/components/RefreshButton';
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
  const [timestamp, setTimestamp] = useState('');

  const onButtonClick = () => {
    window.electron.ipcRenderer.sendMessage('rdp-test', []);
  };

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
      </header>

      <main>
        <p>
          <strong>{t('Timestamp')}:</strong> {timestamp}
        </p>
        <p>
          <strong>{t('Platform')}:</strong> {platform}
        </p>
        <p>
          <strong>{t('Session')}:</strong> {isRemote ? t('remote') : t('local')}
        </p>
      </main>
    </div>
  );
};

export default withTranslation()(Index);
