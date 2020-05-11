
import windowsIcon from 'simple-icons/icons/windows'
import linuxIcon from 'simple-icons/icons/linux'
import appleIcon from 'simple-icons/icons/apple'
import xboxIcon from 'simple-icons/icons/xbox'
import playstation4Icon from 'simple-icons/icons/playstation4'
import nintendoSwitchIcon from 'simple-icons/icons/nintendoswitch'
import iosIcon from 'simple-icons/icons/ios'

import { getValue } from '../../utils/getValue'
import { createElementFromHTMLString } from '../../utils/createElementFromHTMLString'


const platformsConfig = {
  'windows': {
    icon: windowsIcon,
    aliases: [
      'microsoft'
    ]
  },
  'linux': {
    icon: {
      ...linuxIcon,
      hex: '000'
    },
    aliases: [
    ]
  },
  'mac os': {
    icon: appleIcon,
    aliases: [
      'osx'
    ]
  },
  'xbox one': {
    icon: xboxIcon,
    aliases: [
    ]
  },
  'playstation 4': {
    icon: playstation4Icon,
    aliases: [
      'ps',
      'ps4'
    ]
  },
  'nintendo switch': {
    icon: nintendoSwitchIcon,
    aliases: [
    ]
  },
  'ios': {
    icon: iosIcon,
    aliases: [
      'iphone'
    ]
  },
}


/**
 * @param {string} platform
 */
function getAliasesFor(platform) {
  let aliases = [
    platform.replace(' ', '')
  ]

  if (platform in platformsConfig) {
    const platformConfig = platformsConfig[platform]
    if ('aliases' in platformConfig) {
      aliases = aliases.concat(platformConfig.aliases)
    }
  }

  return aliases
}

/**
 * @param {string} platform 
 */
function renderPlatformIcon(platform) {
  if (platform in platformsConfig) {
    const platformIcon = createElementFromHTMLString(platformsConfig[platform].icon.svg)
    platformIcon.setAttribute('fill', '#' + platformsConfig[platform].icon.hex)
    return platformIcon
  }
}

/**
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function getQuickFilterText(params) {
  // TODO: think about enabling cache cause this is a very expencive operation which ran at each quick search update
  const platforms = getValue(params)
  if (platforms) {
    return platforms.join('')
  }
}

/**
 * @param {ValueGetterParams} params
 * @returns {Object}
 */
function valueGetter(params) {
  const platformsStr = params.data.platforms || ''
  let platforms = platformsStr.split(',').map(str => str.toLowerCase().trim())
  for (const platform of platforms) {
    platforms = platforms.concat(getAliasesFor(platform))
  }
  return Array.from(new Set(platforms))
}

/**
 * @param {ICellRendererParams} params
 * @returns {any}
 */
function cellRenderer(params) {
  const platforms = getValue(params)
  const el = params.eGridCell

  if (platforms.length) {
    for (const platform of platforms) {
      const icon = renderPlatformIcon(platform)
      if (icon) el.appendChild(icon)
    }
  }
}

export const field = {
  field: "platforms",
  headerName: "Платформы",
  getQuickFilterText,
  valueGetter,
  cellRenderer
}
