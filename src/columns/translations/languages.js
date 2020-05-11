
import { languagesData } from './languagesData';


/**
 * @param {string} index
 * @retunrs {array}
 */
function getLanguageByIndex(index) {
  const result = []

  for (const language of Object.keys(languagesData.text)) {
    const lang = languagesData.text[language]
    if (index < lang.length) {
      result.push(lang[index])
    }
  }

  return result
}


/**
 * @param {string} code
 * @retunrs {array}
 */
export function getLanguageFor(code) {
  code = code.toLowerCase()

  for (const codeSystemName of Object.keys(languagesData.code)) {
    const languageCodeSystem = languagesData.code[codeSystemName]

    for (const codeName of Object.keys(languageCodeSystem)) {
      if (code === codeName) {
        return getLanguageByIndex(languageCodeSystem[codeName])
      }
    }
  }
}
