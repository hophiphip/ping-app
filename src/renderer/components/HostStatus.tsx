import '../css/HostStatus.css';

interface Props {
  address: string;
  status: boolean;
}

/**
 * Component that shows host status.
 * @param address - Host IP address.
 * @param status  - Host status (Up/Down).
 * @returns {JSX.Element}
 */
const HostStatus = ({ address, status }: Props) => {
  return (
    <li className="host">
      {address}

      <div className="padding" />

      {status ? (
        <div className="icon up">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ) : (
        <div className="icon down">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
    </li>
  );
};

export default HostStatus;
