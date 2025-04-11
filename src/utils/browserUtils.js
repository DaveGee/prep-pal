/**
 * Check if running in Electron
 * @returns {boolean} True if running in Electron
 */
export const isElectron = () => {
  return window && window.process && window.process.type
}

/**
 * Open a URL in the default browser
 * @param {string} url - The URL to open
 * @returns {void}
 */
export const openInBrowser = (url) => {
  if (!url) return
  
  if (isElectron()) {
    // Use Electron's shell to open external links in the default browser
    const { shell } = window.require('electron')
    shell.openExternal(url)
  } else {
    // Use window.open for web browser environment
    window.open(url, '_blank')
  }
}
