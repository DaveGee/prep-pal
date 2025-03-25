// Import the default data for fallback in web browser environment
import defaultProductCategories from '../data/productCategories.json'

// Check if running in Electron
const isElectron = () => {
  return window && window.process && window.process.type
}

// Local storage key for product categories
const STORAGE_KEY = 'mystock_product_categories'

/**
 * Read product categories from disk using Electron IPC or localStorage in browser
 * @returns {Promise<Object>} The product categories data
 */
export const readProductCategories = async () => {
  try {
    // If running in Electron, use IPC to read from disk
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron')
      try {
        const data = await ipcRenderer.invoke('read-product-categories')
        
        // Check if data exists and is valid
        if (!data || Object.keys(data).length === 0) {
          console.log('No data from Electron IPC, using default data')
          // Save the default data for future use
          await writeProductCategories(defaultProductCategories)
          return defaultProductCategories
        }
        
        return data
      } catch (ipcError) {
        console.error('Error with Electron IPC:', ipcError)
        console.log('IPC error, using default data')
        return defaultProductCategories
      }
    } else {
      // In browser, try to get from localStorage first
      const storedData = localStorage.getItem(STORAGE_KEY)
      
      if (storedData) {
        console.log('Reading data from localStorage')
        return JSON.parse(storedData)
      } else {
        // If no data in localStorage, use the default data and save it
        console.log('No data in localStorage, using default data')
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProductCategories))
        return defaultProductCategories
      }
    }
  } catch (error) {
    console.error('Error reading product categories:', error)
    // Fallback to imported JSON in case of error
    console.log('Error occurred, falling back to imported JSON data')
    return defaultProductCategories
  }
}

/**
 * Write product categories to disk using Electron IPC or localStorage in browser
 * @param {Object} data - The product categories data to write
 * @returns {Promise<boolean>} True if successful
 */
export const writeProductCategories = async (data) => {
  try {
    // If running in Electron, use IPC to write to disk
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron')
      return await ipcRenderer.invoke('write-product-categories', data)
    } else {
      // In browser, save to localStorage
      console.log('Saving data to localStorage')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return true
    }
  } catch (error) {
    console.error('Error writing product categories:', error)
    throw error
  }
}
