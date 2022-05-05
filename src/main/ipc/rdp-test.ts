import { ipcMain } from 'electron';
import ffi from 'ffi-napi';

export default () => {
    ipcMain.on('rdp-test', async (event, _arg) => {
        event.reply('rdp-test', JSON.stringify({
          timestamp: Date.now(),
          platform: process.platform,
          isRdp: isRdp(),
        }));
    });
}

const isRdp = (): Boolean => {
    switch (process.platform) {
        case "win32": {
            return isWindowsRDPEnv();
        }

        default: {
            return isUnixRDPEnv();
        }
    }
}

/**
 * Test if application in Windows OS runs in RDP service environment.
 *  Reference: https://docs.microsoft.com/en-us/windows/win32/termserv/detecting-the-terminal-services-environment
 * @returns Boolean
 */
const isWindowsRDPEnv = (): Boolean => {
    const SM_REMOTESESSION = 0x1000;
    const libUser32 = ffi.Library('user32', {
        'GetSystemMetrics': [
            'bool', [ 'int32' ]
        ]
    });

    const isRdpDetected = libUser32.GetSystemMetrics(SM_REMOTESESSION);

    return isRdpDetected;
}

/**
 * Test if application in Unix-like os runs in RDP service environment.
 * During RDP/Remote session display environment variable must be different from the default one.
 * @returns Boolean
 */
const isUnixRDPEnv = (): Boolean => {
    const defaultLinuxDisplay = ':0';
    return process.env.DISPLAY !== defaultLinuxDisplay;
}