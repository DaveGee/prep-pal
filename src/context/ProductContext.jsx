import React, { createContext, useState, useEffect, useContext } from 'react'
import { 
  readProductCategories, 
  writeProductCategories,
  readStock,
  writeStock
} from '../utils/fileUtils'

// Create the context
const ProductContext = createContext()

// Custom hook to use the product context
export const useProductContext = () => useContext(ProductContext)

// Provider component
export const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState({
    lastCategoriesUpdate: '',
    baseCategories: [],
    stock: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load data from disk on component mount
  useEffect(() => {
    loadProductData()
  }, [])

  // Function to load product data from disk
  const loadProductData = async () => {
    try {
      setLoading(true)
      const data = await readProductCategories()
      const stock = await readStock()
      
      setProductData({
        baseCategories: data.baseCategories,
        lastCategoriesUpdate: data.lastUpdate,
        stock
      })
      setError(null)
    } catch (err) {
      console.error('Failed to load product data:', err)
      setError('Failed to load product data')
    } finally {
      setLoading(false)
    }
  }

  // Function to save product data to disk
  const saveProductCategoriesData = async (newData) => {
    try {
      setLoading(true)
      // Update the lastUpdate field
      const updatedData = {
        ...newData,
        lastUpdate: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
      }
      
      await writeProductCategories(updatedData)
      setProductData({
        ...productData,
        baseCategories: updatedData.baseCategories,
        lastCategoriesUpdate: updatedData.lastUpdate
      })
      setError(null)
      return true
    } catch (err) {
      console.error('Failed to save product data:', err)
      setError('Failed to save product data')
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
      setError(null)

      return true
    } catch (err) {
      console.error('Failed to save stock data:', err)
      setError('Failed to save stock data')
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
    loadProductData,
    updateCategory,
    saveStockData
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}
