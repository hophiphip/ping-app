import { ipcMain } from 'electron';
import ffi from 'ffi-napi';
import ref from 'ref-napi';

export default () => {
    ipcMain.on('rdp-test', async (event, _arg) => {
        event.reply('rdp-test', JSON.stringify({
          timestamp: Date.now(),
          platform: process.platform,
          isRdp: isRdp(),
        }));
    });
};

const isRdp = (): Boolean => {
  switch (process.platform) {
    case "win32": {
      return isWindowsRDPEnv();
    }

    default: {
      return isUnixRDPEnv();
    }
  }
};

/**
 * Test if application in Windows OS runs in RDP service environment.
 *  Reference: https://docs.microsoft.com/en-us/windows/win32/termserv/detecting-the-terminal-services-environment
 * @returns Boolean
 */
const isWindowsRDPEnv = (): boolean => {
  const SM_REMOTESESSION = 0x1000;

  // For later
  //const wchar_size = process.platform == 'win32' ? 2 : 4;

  const HKEY_LOCAL_MACHINE_VAL  = 0x80000002; // uint
  let   HKEY_LOCAL_MACHINE_BUF  = ref.alloc('int');
  HKEY_LOCAL_MACHINE_BUF.writeUInt32LE(HKEY_LOCAL_MACHINE_VAL, 0);
  const HKEY_LOCAL_MACHINE      = ref.ref(HKEY_LOCAL_MACHINE_BUF);

  const TERMINAL_SERVER_KEY_VAL = UTF8ToUTF16("SYSTEM\\CurrentControlSet\\Control\\Terminal Server\\");
  let   TERMINAL_SERVER_KEY_BUF = ref.alloc('CString');
  TERMINAL_SERVER_KEY_BUF.writeCString(TERMINAL_SERVER_KEY_VAL);
  const TERMINAL_SERVER_KEY     = ref.ref(TERMINAL_SERVER_KEY_BUF);

  const GLASS_SESSION_ID_VAL = UTF8ToUTF16("GlassSessionId");
  let   GLASS_SEsSION_ID_BUF = ref.alloc('CString');
  GLASS_SEsSION_ID_BUF.writeCString(GLASS_SESSION_ID_VAL);
  const GLASS_SESSION_ID     = ref.ref(TERMINAL_SERVER_KEY_BUF);

  const KEY_READ = 0; // ? Not supported; set to 0. ? Microsoft Docs..WTF

  const ERROR_SUCCESS = 0; // Is this an error ? Or a success ? Thanks Microsoft.

  let hRegKey = ref.alloc('void **');

  const libUser32 = ffi.Library('user32', {
    'GetSystemMetrics': [
      'bool', [ 'int32' ]
    ],
  });

  const libAdvapi32 = ffi.Library('advapi32', {
    'RegOpenKeyEx': [
      'long', [       // LONG - long
        'void *',     // HKEY - HANDLE - PVOID - void*
        'wchar_t *',  // LPCWSTR - CONST WCHAR* - const wchar_t*
        'ulong',      // DWORD - unsigned long
        'ulong',      // REGSAM - ULONG - unsigned long
        'void **'     // PHKEY - HKEY* - HANDLE* - PVOID* - void**
      ]
    ],
    'RegQueryValueEx': [
      'long', [      // LONG
        'void *',    // HKEY
        'wchar_t *', // LPCWSTR
        'long *',    // LPDWORD
        'long *',    // LPDWORD
        'byte *',    // LPBYTE
        'long *',    // LPDWORD
      ]
    ],
    'ProcessIdToSessionId': [
      'bool', [    // BOOL
        'ulong',   // DWORD
        'ulong *', // DWORD*
      ]
    ],
    'RegCloseKey': [
      'void', [
        'void *' // HKEY
      ]
    ],
    'GetCurrentProcessId': [
      'ulong', [ // DWORD
        'void'
      ]
    ]
  });

  if (libUser32.GetSystemMetrics(SM_REMOTESESSION)) {
    return true;
  }

  let isRemoteable = false;

  // Needs more testing
  //let lResult = libAdvapi32.RegOpenKeyEx(
  //  HKEY_LOCAL_MACHINE,
  //  TERMINAL_SERVER_KEY,
  //  0,
  //  KEY_READ,
  //  hRegKey
  //);
  //
  //if (lResult == ERROR_SUCCESS) {
  //  let dwGlassSessionId = ref.alloc('uint');
  //  let dwGlassSessionIdPtr = ref.ref(dwGlassSessionId);
  //
  //  let cbGlassSessionId = ref.alloc('uint');
  //  cbGlassSessionId.writeUInt32LE(4, 0);
  //  let cbGlassSessionIdPtr = ref.ref(cbGlassSessionId);
  //
  //  let dwType = ref.alloc('uint');
  //  let dwTypePtr = ref.ref(dwType);
  //
  //  lResult = libAdvapi32.RegQueryValueEx(
  //    hRegKey,
  //    GLASS_SESSION_ID,
  //    ref.NULL_POINTER,
  //    dwTypePtr,
  //    dwGlassSessionIdPtr,
  //    cbGlassSessionIdPtr
  //  );
  //
  //  if (lResult == ERROR_SUCCESS) {
  //    let dwCurrentSessionId = ref.alloc('uint');
  //    let dwCurrentSessionIdPtr = ref.ref(dwCurrentSessionId);
  //
  //    let currentProcessId = libAdvapi32.GetCurrentProcessId();
  //
  //    if (libAdvapi32.ProcessIdToSessionId(currentProcessId, dwCurrentSessionIdPtr)) {
  //      isRemoteable = (dwCurrentSessionId != dwGlassSessionId);
  //    }
  //  }
  //}
  //
  //if (hRegKey) {
  //  libAdvapi32.RegCloseKey(hRegKey);
  //}

  return isRemoteable;
};


/**
 * Test if application in Unix-like os runs in RDP service environment.
 * During RDP/Remote session display environment variable must be different from the default one.
 * @returns Boolean
 */
const isUnixRDPEnv = (): boolean => {
  const defaultLinuxDisplay = ':0';
  return process.env.DISPLAY !== defaultLinuxDisplay;
};


/**
 * Convert UTF-8 string to UTF-16 string.
 * @param text string that needs to be converted to UTF-16
 * @returns string converted to UFT-16
 */
const UTF8ToUTF16 = (text: string): string => {
  return Buffer.from(text, 'ucs2').toString('binary');
};
