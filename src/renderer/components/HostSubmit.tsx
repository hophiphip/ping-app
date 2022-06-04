import '../css/HostSubmit.css';
import i18next from '../i18n';

interface Props {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  value: string;
  onNewAddress: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * Components that shows a new host submit form.
 * @param onSubmit     - On HTML form submit event handler.
 * @param value        - Form submit value.
 * @param onNewAddress - On form value change event handler.
 * @returns {JSX.Element}
 */
const HostSubmit = ({ onSubmit, value, onNewAddress }: Props) => {
  return (
    <form className="form" onSubmit={onSubmit}>
      <input
        className="input"
        value={value}
        type="text"
        onChange={onNewAddress}
        placeholder={`${i18next.t('Enter pingable address')}..`}
      />

      <button className="submit" type="submit">
        {i18next.t('Add')}
      </button>
    </form>
  );
};

export default HostSubmit;
