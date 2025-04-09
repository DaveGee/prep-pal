import React, { createContext, useState, useEffect, useContext } from 'react'
import { 
  readProductCategories, 
  writeProductCategories,
  readStock,
  writeStock,
  checkProductCategoriesExist,
  checkStockExists,
  initializeDatabases,
  deleteDatabases
} from '../utils/fileUtils'
import { useLittera } from '@assembless/react-littera'

const translations = {
  failedLoadingData: {
    fr_CH: "Échec du chargement des données produit",
    de_CH: "Fehler beim Laden der Produktdaten",
    en_US: "Failed to load product data"
  },
  failedSavingData: {
    fr_CH: "Échec de l'enregistrement des données produit",
    de_CH: "Fehler beim Speichern der Produktdaten",
    en_US: "Failed to save product data"
  },
  failedSavingStockData: {
    fr_CH: "Échec de l'enregistrement des données de stock",
    de_CH: "Fehler beim Speichern der Bestandsdaten",
    en_US: "Failed to save stock data"
  },
  failedDeletingData: {
    fr_CH: "Échec de la suppression des données",
    de_CH: "Fehler beim Löschen der Daten",
    en_US: "Failed to delete data"
  }
}

// Create the context
const ProductContext = createContext()

// Custom hook to use the product context
export const useProductContext = () => useContext(ProductContext)

// Provider component
export const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState({
    lastCategoriesUpdate: '',
    baseCategories: [],
    stock: {
      products: []
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filesExist, setFilesExist] = useState({
    categories: false,
    stock: false
  })

  const translated = useLittera(translations)

  // Check if files exist and load data on component mount
  useEffect(() => {
    checkFilesAndLoadData()
  }, [])

  const checkFilesAndLoadData = async () => {
    try {
      setLoading(true)
      
      // Check if files exist
      const categoriesExist = await checkProductCategoriesExist()
      const stockExists = await checkStockExists()
      
      console.log('Database files existence check:', { categoriesExist, stockExists })
      
      setFilesExist({
        categories: categoriesExist,
        stock: stockExists
      })
      
      // Only load data if both files exist
      if (categoriesExist && stockExists) {
        await loadProductData()
      } else {
        // Files don't exist, keep data empty
        setLoading(false)
      }
    } catch (err) {
      console.error('Failed to check files:', err)
      setError(translated.failedLoadingData)
      setLoading(false)
    }
  }

  // Function to load product data from disk
  const loadProductData = async () => {
    try {
      setLoading(true)
      
      console.log('Loading product data from databases')
      
      const data = await readProductCategories()
      const stock = await readStock()
      
      console.log('Loaded data:', { categories: data, stock })
      
      setProductData({
        baseCategories: data.baseCategories,
        lastCategoriesUpdate: data.lastUpdate,
        stock
      })
      
      setError(null)
    } catch (err) {
      console.error('Failed to load product data:', err)
      setError(translated.failedLoadingData)
    } finally {
      setLoading(false)
    }
  }

  // Function to initialize databases with default data
  const initializeData = async () => {
    try {
      setLoading(true)
      
      console.log('Initializing databases with default data')
      
      // Initialize databases with default data
      await initializeDatabases()
      
      console.log('Databases initialized, updating state')
      
      // Update filesExist state
      setFilesExist({
        categories: true,
        stock: true
      })
      
      // Load the data from the newly created files
      await loadProductData()
      
      return true
    } catch (err) {
      console.error('Failed to initialize databases:', err)
      setError(translated.failedSavingData)
      return false
    }
  }

  // Function to reset databases (delete only, no initialization)
  const resetDatabases = async () => {
    try {
      setLoading(true)
      
      console.log('Deleting databases')
      
      await deleteDatabases()
      
      setFilesExist({
        categories: false,
        stock: false
      })
      
      setProductData({
        lastCategoriesUpdate: '',
        baseCategories: [],
        stock: {
          products: []
        }
      })
      
      setError(null)
      setLoading(false)
      
      return true
    } catch (err) {
      console.error('Failed to reset databases:', err)
      setError(translated.failedDeletingData)
      setLoading(false)
      return false
    }
  }

  // Function to save product data to disk
  const saveProductCategoriesData = async (newData) => {
    try {
      setLoading(true)
      // Update the lastUpdate field
      const updatedData = {
        baseCategories: newData.baseCategories,
        lastUpdate: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
      }
      
      await writeProductCategories(updatedData)
      setProductData({
        ...productData,
        baseCategories: updatedData.baseCategories,
        lastCategoriesUpdate: updatedData.lastUpdate
      })
      
      // Update filesExist state
      setFilesExist({
        ...filesExist,
        categories: true
      })
      
      setError(null)
      return true
    } catch (err) {
      console.error('Failed to save product data:', err)
      setError(translated.failedSavingData)
      return false
    } finally {
      setLoading(false)
    }
  }

  const saveStockData = async (newData) => {
    try {
      setLoading(true)

      await writeStock(newData)

      setProductData({
        ...productData,
        stock: newData
      })
      
      // Update filesExist state
      setFilesExist({
        ...filesExist,
        stock: true
      })
      
      setError(null)

      return true
    } catch (err) {
      console.error('Failed to save stock data:', err)
      setError(translated.failedSavingStockData)
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateCategory = async (categoryId, updatedCategory) => {
    const newData = { ...productData }
    
    const baseIndex = newData.baseCategories.findIndex(cat => cat.id === categoryId)
    if (baseIndex !== -1) {
      newData.baseCategories[baseIndex] = {
        ...newData.baseCategories[baseIndex],
        ...updatedCategory
      }
      return await saveProductCategoriesData(newData)
    }

    return false
  }

  const value = {
    productData,
    loading,
    error,
    filesExist,
    loadProductData,
    updateCategory,
    saveStockData,
    initializeData,
    resetDatabases,
    checkFilesAndLoadData
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}
