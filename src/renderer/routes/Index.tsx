import { useEffect, useState } from 'react';
import { TFunction, WithTranslation, withTranslation } from 'react-i18next';
import Select from 'react-select';
import { isIP } from 'is-ip';
import HostSubmit from '../components/HostSubmit';
import HostList from '../components/HostList';
import RefreshButton from '../components/RefreshButton';
import Platform from '../components/Platform';
import Host from '../models/Host';

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

    if (isIP(addressInput)) {
      setHosts([...hosts, { host: addressInput, status: false }]);
    }

    setAddressInput('');
  };

  useEffect(() => {
    // Request update only once on load
    window.electron.ipcRenderer.sendMessage('rdp-test', []);
    window.electron.ipcRenderer.sendMessage('host-ip', []);

    // Listen for RDP tester responses
    window.electron.ipcRenderer.on('rdp-test', (data) => {
      const values = JSON.parse(String(data));

      setIsRemote(values.isRdp);
      setPlatform(values.platform);
    });

    // List for host network info responses
    window.electron.ipcRenderer.on('host-ip', (data) => {
      const values = JSON.parse(String(data));

      setAddress(values.ip);
    });

    // Listen for ping tester responses
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

        <HostList hosts={hosts} />

        <HostSubmit
          onSubmit={onSubmit}
          value={addressInput}
          onNewAddress={onNewAddress}
        />
      </main>
    </div>
  );
};

export default withTranslation()(Index);
