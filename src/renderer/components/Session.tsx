import i18next from '../i18n';

interface Props {
  isRemote: boolean;
}

const Session = ({ isRemote }: Props) => {
  return (
    <p>
      <strong>{i18next.t('Session')}:</strong>{' '}
      {isRemote ? i18next.t('remote') : i18next.t('local')}
    </p>
  );
};

export default Session;
