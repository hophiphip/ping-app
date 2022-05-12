import HostStatus from './HostStatus';
import Host from '../models/Host';

interface Props {
  hosts: Host[];
}

const HostList = ({ hosts }: Props) => {
  return (
    <ul className="host-list">
      {hosts.map((host) => {
        return (
          <HostStatus
            key={`${host.host}-${Date.now()}`}
            address={host.host}
            status={host.status}
          />
        );
      })}
    </ul>
  );
};

export default HostList;
