import linuxLogo from 'super-tiny-icons/images/svg/linux.svg';
import windowsLogo from 'super-tiny-icons/images/svg/windows.svg';
import darwinLogo from 'super-tiny-icons/images/svg/macos.svg';

import i18next from '../i18n';

interface Props {
  platform: string;
  remSize?: number;
}

const Platform = ({ platform, remSize = 2 }: Props) => {
  const iconStyle = {
    width: `${remSize}rem`,
    height: `${remSize}rem`,
  };

  let logo;

  switch (platform) {
    case 'linux': {
      logo = linuxLogo;
      break;
    }

    case 'win32': {
      logo = windowsLogo;
      break;
    }

    case 'darwin': {
      logo = darwinLogo;
      break;
    }

    default:
  }

  return logo !== undefined ? (
    <img src={logo} style={iconStyle} alt={i18next.t('Unknown OS')} />
  ) : (
    <div />
  );
};

Platform.defaultProps = {
  remSize: 2,
};

export default Platform;
