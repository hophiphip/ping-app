/**
 * Represents application session.
 * @property {boolean} isRemote - Was app started from remote session.
 * @property {string} platform  - OS/Platform the application is running on.
 * @property {string} address   - Local IP address of network interface.
 */
export default interface Session {
  isRemote: boolean;
  platform: string;
  address: string;
}
