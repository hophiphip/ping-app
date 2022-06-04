import i18next from '../i18n';

interface Props {
  isRemote: boolean;
}

/**
 * Component that represents session status.
 * @param {boolean} isRemote - Is session remote.
 * @returns {JSX.Element}
 */
const Session = ({ isRemote }: Props) => {
  return (
    <p>
      <strong>{i18next.t('Session')}:</strong>{' '}
      {isRemote ? i18next.t('remote') : i18next.t('local')}
    </p>
  );
};

export default Session;
