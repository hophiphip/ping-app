import HostStatus from './HostStatus';
import Host from '../models/Host';

interface Props {
  hosts: Host[];
}

const HostList = ({ hosts }: Props) => {
  return (
    <div className="host-list">
      {hosts.map((host) => {
        return (
          <HostStatus
            key={`${host.host}-${Date.now()}`}
            host={host.host}
            status={host.status}
          />
        );
      })}
    </div>
  );
};

export default HostList;
