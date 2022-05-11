import UTF8ToUTF16 from './utf8-to-utf16';

const ffi = process.platform !== 'win32' ? undefined : require('ffi-napi'); // NOTE: I guess mixing different imports is bad: mb. try: import('ffi-napi').then(...)
const ref = process.platform !== 'win32' ? undefined : require('ref-napi');
const types =
  process.platform !== 'win32' ? undefined : require('../types/win32');

/**
 * Test if application in Windows OS runs in terminial service environment.
 *  Reference: https://docs.microsoft.com/en-us/windows/win32/termserv/detecting-the-terminal-services-environment
 * @returns Boolean
 */
export const isWindowsRDPEnv = (): boolean => {
  if (process.platform !== 'win32') return false;

  if (ffi === undefined || ref === undefined || types === undefined)
    return false;

  const SM_REMOTESESSION = 0x1000;

  const HKEY_LOCAL_MACHINE_VAL = 0x80000002; // uint
  const HKEY_LOCAL_MACHINE_BUF = ref.alloc('int');
  HKEY_LOCAL_MACHINE_BUF.writeUInt32LE(HKEY_LOCAL_MACHINE_VAL, 0); // TODO: But what if machine is big-endian ?
  const HKEY_LOCAL_MACHINE = ref.ref(HKEY_LOCAL_MACHINE_BUF);

  const TERMINAL_SERVER_KEY_VAL = UTF8ToUTF16(
    'SYSTEM\\CurrentControlSet\\Control\\Terminal Server\\'
  );
  const TERMINAL_SERVER_KEY_BUF = ref.alloc('CString');
  TERMINAL_SERVER_KEY_BUF.writeCString(TERMINAL_SERVER_KEY_VAL);
  const TERMINAL_SERVER_KEY = ref.ref(TERMINAL_SERVER_KEY_BUF);

  const GLASS_SESSION_ID_VAL = UTF8ToUTF16('GlassSessionId');
  const GLASS_SESSION_ID_BUF = ref.alloc('CString');
  GLASS_SESSION_ID_BUF.writeCString(GLASS_SESSION_ID_VAL);
  const GLASS_SESSION_ID = ref.ref(TERMINAL_SERVER_KEY_BUF);

  const KEY_READ = 0; // Docs say that it is unsupported key with default value of 0.

  const ERROR_SUCCESS = 0; // Is this an error ? Or a success ? Thanks Microsoft.

  const hRegKey = ref.alloc('void **');

  const libUser32 = ffi.Library('user32', {
    GetSystemMetrics: ['bool', ['int32']],
  });

  const libAdvapi32 = ffi.Library('Advapi32', {
    RegOpenKeyExA: [
      'long',
      [
        // LONG
        'longlong', // HKEY
        'string', // LPCWSTR
        types.DWORD, // DWORD
        types.REGSAM, // REGSAM
        types.PHKEY, // PHKEY
      ],
    ],
    RegQueryValueExA: [
      'long',
      [
        // LONG
        types.HKEY, // HKEY
        'string', // LPCWSTR
        'pointer', // LPDWORD
        types.LPDWORD, // LPDWORD
        types.LPBYTE, // LPBYTE
        types.LPDWORD, // LPDWORD
      ],
    ],
    RegCloseKey: [
      'void',
      [
        types.HKEY, // HKEY
      ],
    ],
  });

  const libKernel32 = ffi.Library('Kernel32', {
    ProcessIdToSessionId: [
      'bool',
      [
        // BOOL
        types.DWORD, // DWORD
        types.LPDWORD, // DWORD*
      ],
    ],
    GetCurrentProcessId: [
      types.DWORD,
      [
        // DWORD
        'void',
      ],
    ],
  });

  if (libUser32.GetSystemMetrics(SM_REMOTESESSION)) {
    return true;
  }

  let isRemoteable = false;

  let lResult = libAdvapi32.RegOpenKeyExA(
    HKEY_LOCAL_MACHINE,
    TERMINAL_SERVER_KEY,
    0,
    KEY_READ,
    hRegKey
  );

  if (lResult === ERROR_SUCCESS) {
    const dwGlassSessionId = ref.alloc('uint');
    const dwGlassSessionIdPtr = ref.ref(dwGlassSessionId);

    const cbGlassSessionId = ref.alloc('uint');
    cbGlassSessionId.writeUInt32LE(4, 0);
    const cbGlassSessionIdPtr = ref.ref(cbGlassSessionId);

    const dwType = ref.alloc('uint');
    const dwTypePtr = ref.ref(dwType);

    lResult = libAdvapi32.RegQueryValueExA(
      hRegKey,
      GLASS_SESSION_ID,
      ref.NULL_POINTER,
      dwTypePtr,
      dwGlassSessionIdPtr,
      cbGlassSessionIdPtr
    );

    if (lResult === ERROR_SUCCESS) {
      const dwCurrentSessionId = ref.alloc('uint');
      const dwCurrentSessionIdPtr = ref.ref(dwCurrentSessionId);

      const currentProcessId = libKernel32.GetCurrentProcessId();

      if (
        libKernel32.ProcessIdToSessionId(
          currentProcessId,
          dwCurrentSessionIdPtr
        )
      ) {
        isRemoteable = dwCurrentSessionId !== dwGlassSessionId;
      }
    }
  }

  if (hRegKey) {
    libAdvapi32.RegCloseKey(hRegKey);
  }

  return isRemoteable;
};

/**
 * Test if application in Unix-like OS started in RDP/VNC session.
 * During remote session display environment variable must be different from the default one.
 * @returns boolean
 */
export const isUnixRDPEnv = (): boolean => {
  const defaultLinuxDisplay = ':0';
  return process.env.DISPLAY !== defaultLinuxDisplay;
};

/**
 * Test if app was started from remote session.
 * @returns boolean indicating whether app was started from remote session.
 */
export const isRdp = (): boolean => {
  switch (process.platform) {
    case 'win32': {
      return isWindowsRDPEnv();
    }

    default: {
      return isUnixRDPEnv();
    }
  }
};
