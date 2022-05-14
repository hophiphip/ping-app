import { useEffect, useState } from 'react';
import { TFunction, WithTranslation, withTranslation } from 'react-i18next';
import Select from 'react-select';
import { isIP } from 'is-ip';
import useHostsStatuses from 'renderer/hooks/useHostsStatuses';
import HostSubmit from '../components/HostSubmit';
import HostList from '../components/HostList';
import RefreshButton from '../components/RefreshButton';
import Platform from '../components/Platform';

import i18next from '../i18n';

import '../css/Index.css';
import Session from '../components/Session';
import useSessionState from '../hooks/useSessionState';

interface Props {
  t: TFunction<'translation', undefined>;
}

const Index: React.FC<WithTranslation> = ({ t }: Props) => {
  const languages = i18next.languages.map((language) => ({
    value: language,
    label: language,
  }));

  const [session, updateSession] = useSessionState();
  const [addressInput, setAddressInput] = useState('');
  const { hosts, addHost, updateHostsSync } = useHostsStatuses({
    initial: [{ host: '127.0.0.1', status: false }],
  });

  const onButtonClick = () => {
    updateSession();
    updateHostsSync();
  };

  const onNewAddress = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInput(evt.currentTarget.value);
  };

  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (isIP(addressInput)) {
      addHost({ host: addressInput, status: false });
    }

    setAddressInput('');
  };

  useEffect(() => {
    updateSession();
    updateHostsSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        <Session isRemote={session.isRemote} />

        <Platform platform={session.platform} remSize={2.375} />
      </header>

      <main>
        <h2>{t('IP address')}</h2>
        <h1>{session.address}</h1>

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
