import '../css/HostSubmit.css';
import i18next from '../i18n';

interface Props {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  value: string;
  onNewAddress: React.ChangeEventHandler<HTMLInputElement>;
}

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
        Add
      </button>
    </form>
  );
};

export default HostSubmit;
