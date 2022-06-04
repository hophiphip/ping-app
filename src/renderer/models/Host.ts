/**
 * Represents remote host.
 * @property {string} host    - Host IP address or hostname.
 * @property {boolean} status - Host status (up/down).
 */
export default interface Host {
  host: string;
  status: boolean;
}
