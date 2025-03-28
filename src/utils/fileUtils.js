// Import the default data for fallback in web browser environment
import defaultProductCategories from '../data/productCategories.json'
import defaultStock from '../data/stock.json'

// Check if running in Electron
const isElectron = () => {
  return window && window.process && window.process.type
}

// Local storage keys
const PRODUCT_CATEGORIES_STORAGE_KEY = 'mystock_product_categories'
const STOCK_STORAGE_KEY = 'mystock_stock'

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
      const storedData = localStorage.getItem(PRODUCT_CATEGORIES_STORAGE_KEY)
      
      if (storedData) {
        console.log('Reading data from localStorage')
        return JSON.parse(storedData)
      } else {
        // If no data in localStorage, use the default data and save it
        console.log('No data in localStorage, using default data')
        localStorage.setItem(PRODUCT_CATEGORIES_STORAGE_KEY, JSON.stringify(defaultProductCategories))
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
      localStorage.setItem(PRODUCT_CATEGORIES_STORAGE_KEY, JSON.stringify(data))
      return true
    }
  } catch (error) {
    console.error('Error writing product categories:', error)
    throw error
  }
}

/**
 * Read stock data from disk using Electron IPC or localStorage in browser
 * @returns {Promise<Object>} The stock data
 */
export const readStock = async () => {
  try {
    // If running in Electron, use IPC to read from disk
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron')
      try {
        const data = await ipcRenderer.invoke('read-stock')
        
        // Check if data exists and is valid
        if (!data || Object.keys(data).length === 0) {
          console.log('No stock data from Electron IPC, using default data')
          // Save the default data for future use
          await writeStock(defaultStock)
          return defaultStock
        }
        
        return data
      } catch (ipcError) {
        console.error('Error with Electron IPC:', ipcError)
        console.log('IPC error, using default stock data')
        return defaultStock
      }
    } else {
      // In browser, try to get from localStorage first
      const storedData = localStorage.getItem(STOCK_STORAGE_KEY)
      
      if (storedData) {
        console.log('Reading stock data from localStorage')
        return JSON.parse(storedData)
      } else {
        // If no data in localStorage, use the default data and save it
        console.log('No stock data in localStorage, using default data')
        localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(defaultStock))
        return defaultStock
      }
    }
  } catch (error) {
    console.error('Error reading stock data:', error)
    // Fallback to imported JSON in case of error
    console.log('Error occurred, falling back to imported stock JSON data')
    return defaultStock
  }
}

/**
 * Write stock data to disk using Electron IPC or localStorage in browser
 * @param {Object} data - The stock data to write
 * @returns {Promise<boolean>} True if successful
 */
export const writeStock = async (data) => {
  try {
    // If running in Electron, use IPC to write to disk
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron')
      return await ipcRenderer.invoke('write-stock', data)
    } else {
      // In browser, save to localStorage
      console.log('Saving stock data to localStorage')
      localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(data))
      return true
    }
  } catch (error) {
    console.error('Error writing stock data:', error)
    throw error
  }
}
