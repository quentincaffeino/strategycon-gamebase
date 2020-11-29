
import windowsIcon from 'simple-icons/icons/windows'
import linuxIcon from 'simple-icons/icons/linux'
import appleIcon from 'simple-icons/icons/apple'
import xboxIcon from 'simple-icons/icons/xbox'
import playstation4Icon from 'simple-icons/icons/playstation4'
import nintendoSwitchIcon from 'simple-icons/icons/nintendoswitch'
import iosIcon from 'simple-icons/icons/ios'
import androidIcon from 'simple-icons/icons/android'
import { GlobeIcon } from "svelte-feather-icons";

import { getValue } from '../../utils/getValue'
import { createElementFromHTMLString } from '../../utils/createElementFromHTMLString'


const platformsConfig = {
  'windows': {
    icon: windowsIcon,
    aliases: [
      'microsoft',
      'виндовс',
      'майкрософт'
    ]
  },
  'linux': {
    icon: Object.assign({}, linuxIcon, {
      hex: '000'
    }),
    aliases: [
      'unix',
      'юникс',
      'линукс'
    ]
  },
  'mac os': {
    icon: appleIcon,
    aliases: [
      'osx',
      'мак'
    ]
  },
  'xbox one': {
    icon: xboxIcon,
    aliases: [
      'иксбокс'
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
      'свич'
    ]
  },
  'ios': {
    icon: iosIcon,
    aliases: [
      'iphone',
      'айфон'
    ]
  },
  'android': {
    icon: androidIcon,
    aliases: [
      'андроид'
    ]
  },
  'browser': {
    icon: {
      svg: () => {
        const el = document.createElement("div");
        new GlobeIcon({ target: el });
        const icon = el.firstChild;
        icon.removeAttribute('width')
        icon.removeAttribute('height')
        return icon;
      }
    },
    aliases: [
      'браузер'
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
    const icon = platformsConfig[platform].icon
    if (icon) {
      const platformIcon =
        typeof icon.svg === "string"
          ? createElementFromHTMLString(icon.svg)
          : typeof icon.svg === "function"
          ? icon.svg()
          : icon.svg;
      if (icon.hex) {
        platformIcon.setAttribute('fill', '#' + icon.hex)
      }
      return platformIcon
    }
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
  } else {
    return '—'
  }
}

export const field = {
  field: "platforms",
  headerName: "Платформы",
  getQuickFilterText,
  valueGetter,
  cellRenderer
}
