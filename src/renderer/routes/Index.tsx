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

interface Host {
  host: string;
  status: boolean;
}

const Index: React.FC<WithTranslation> = ({ t }: Props) => {
  const languages = i18next.languages.map((language) => ({
    value: language,
    label: language,
  }));

  const [isRemote, setIsRemote] = useState(false);
  const [platform, setPlatform] = useState('');
  const [address, setAddress] = useState('');
  const [addressInput, setAddressInput] = useState('');

  const initialHosts: Host[] = [{ host: '127.0.0.1', status: false }];
  const [hosts, setHosts] = useState<Host[]>(initialHosts);

  const onButtonClick = () => {
    window.electron.ipcRenderer.sendMessage('rdp-test', []);
    window.electron.ipcRenderer.sendMessage('host-ip', []);

    window.electron.ipcRenderer.sendMessage(
      'ping',
      hosts.map((host) => host.host)
    );
  };

  const onNewAddress = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInput(evt.currentTarget.value);
  };

  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setHosts([...hosts, { host: addressInput, status: false }]);
    setAddressInput('');
  };

  useEffect(() => {
    // Request update once on load
    window.electron.ipcRenderer.sendMessage('rdp-test', []);
    window.electron.ipcRenderer.sendMessage('host-ip', []);

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

    window.electron.ipcRenderer.on('ping', (data) => {
      const response = JSON.parse(String(data)) as Host[];
      setHosts(response);
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

        <div>
          {hosts.map((host) => {
            return (
              <div key={host.host}>
                {host.host} {host.status ? 'up' : 'down'}
              </div>
            );
          })}
        </div>

        <form onSubmit={onSubmit}>
          <input
            value={addressInput}
            type="text"
            onChange={onNewAddress}
            placeholder="Enter pingable address.."
          />
          <button type="submit">Add</button>
        </form>
      </main>
    </div>
  );
};

export default withTranslation()(Index);
