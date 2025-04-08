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
 * Check if product categories file exists
 * @returns {Promise<boolean>} True if the file exists
 */
export const checkProductCategoriesExist = async () => {
  try {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron')
      const data = await ipcRenderer.invoke('read-product-categories')
      return data && Object.keys(data).length > 0
    } else {
      const storedData = localStorage.getItem(PRODUCT_CATEGORIES_STORAGE_KEY)
      return !!storedData
    }
  } catch (error) {
    console.warn('Product categories file does not exist')
    return false
  }
}

/**
 * Check if stock file exists
 * @returns {Promise<boolean>} True if the file exists
 */
export const checkStockExists = async () => {
  try {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron')
      const data = await ipcRenderer.invoke('read-stock')
      return data && Object.keys(data).length > 0
    } else {
      const storedData = localStorage.getItem(STOCK_STORAGE_KEY)
      return !!storedData
    }
  } catch (error) {
    console.warn('Stock file does not exist')
    return false
  }
}

/**
 * Read product categories from disk using Electron IPC or localStorage in browser
 * @returns {Promise<Object>} The product categories data
 * @throws {Error} If the file doesn't exist or can't be read
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
          throw new Error('No product categories data found')
        }
        
        return data
      } catch (ipcError) {
        console.error('Error with Electron IPC:', ipcError)
        throw new Error('Failed to read product categories file')
      }
    } else {
      // In browser, try to get from localStorage
      const storedData = localStorage.getItem(PRODUCT_CATEGORIES_STORAGE_KEY)
      
      if (storedData) {
        console.log('Reading data from localStorage')
        return JSON.parse(storedData)
      } else {
        throw new Error('No product categories data found in localStorage')
      }
    }
  } catch (error) {
    console.error('Error reading product categories:', error)
    throw error
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
 * @throws {Error} If the file doesn't exist or can't be read
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
          throw new Error('No stock data found')
        }
        
        return data
      } catch (ipcError) {
        console.error('Error with Electron IPC:', ipcError)
        throw new Error('Failed to read stock file')
      }
    } else {
      // In browser, try to get from localStorage
      const storedData = localStorage.getItem(STOCK_STORAGE_KEY)
      
      if (storedData) {
        console.log('Reading stock data from localStorage')
        return JSON.parse(storedData)
      } else {
        throw new Error('No stock data found in localStorage')
      }
    }
  } catch (error) {
    console.error('Error reading stock data:', error)
    throw error
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

/**
 * Delete product categories file
 * @returns {Promise<boolean>} True if successful
 */
export const deleteProductCategories = async () => {
  try {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron')
      return await ipcRenderer.invoke('delete-product-categories')
    } else {
      localStorage.removeItem(PRODUCT_CATEGORIES_STORAGE_KEY)
      return true
    }
  } catch (error) {
    console.error('Error deleting product categories:', error)
    throw error
  }
}

/**
 * Delete stock file
 * @returns {Promise<boolean>} True if successful
 */
export const deleteStock = async () => {
  try {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron')
      return await ipcRenderer.invoke('delete-stock')
    } else {
      localStorage.removeItem(STOCK_STORAGE_KEY)
      return true
    }
  } catch (error) {
    console.error('Error deleting stock:', error)
    throw error
  }
}

/**
 * Delete all database files
 * @returns {Promise<boolean>} True if successful
 */
export const deleteDatabases = async () => {
  try {
    await deleteProductCategories()
    await deleteStock()
    return true
  } catch (error) {
    console.error('Error deleting databases:', error)
    throw error
  }
}

/**
 * Initialize databases with default data
 * @returns {Promise<boolean>} True if successful
 */
export const initializeDatabases = async () => {
  try {
    await writeProductCategories(defaultProductCategories)
    await writeStock(defaultStock)
    return true
  } catch (error) {
    console.error('Error initializing databases:', error)
    throw error
  }
}
