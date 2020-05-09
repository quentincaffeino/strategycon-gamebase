
import windowsIcon from 'simple-icons/icons/windows';
import linuxIcon from 'simple-icons/icons/linux';
import appleIcon from 'simple-icons/icons/apple';
import xboxIcon from 'simple-icons/icons/xbox';
import nintendoSwitchIcon from 'simple-icons/icons/nintendoswitch';

import { getValue } from '../../utils/getValue'
import { createElementFromHTMLString } from '../../utils/createElementFromHTMLString'


const platformsConfig = {
  'windows': windowsIcon,
  'linux': {
    ...linuxIcon,
    hex: '000'
  },
  'mac os': appleIcon,
  'xbox one': xboxIcon,
  'nintendo switch': nintendoSwitchIcon,
}


function renderPlatformIcon(platform) {
  const platformIcon = createElementFromHTMLString(platformsConfig[platform].svg)
  platformIcon.setAttribute('fill', '#' + platformsConfig[platform].hex)
  return platformIcon
}


function cellRenderer(params) {
  const platformsStr = getValue(params)
  const el = params.eGridCell;

  if (platformsStr) {
    // splitting should be moved to a lower level (prob. value getter)
    const platforms = platformsStr.split(',').map(str => str.toLowerCase().trim())

    if (platforms.length) {
      for (const platform of platforms) {
        if (platform in platformsConfig) {
          el.appendChild(renderPlatformIcon(platform))
        }
      }
    }
  }
}

export const field = {
  field: "platforms",
  headerName: "Платформы",
  cellRenderer
}
