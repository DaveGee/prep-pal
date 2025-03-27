import React, { createContext, useState, useEffect, useContext } from 'react'
import { readProductCategories, writeProductCategories } from '../utils/fileUtils'

// Create the context
const ProductContext = createContext()

// Custom hook to use the product context
export const useProductContext = () => useContext(ProductContext)

// Provider component
export const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState({
    lastUpdate: '',
    baseCategories: [],
    customCategories: []
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
      setProductData(data)
      setError(null)
    } catch (err) {
      console.error('Failed to load product data:', err)
      setError('Failed to load product data')
    } finally {
      setLoading(false)
    }
  }

  // Function to save product data to disk
  const saveProductData = async (newData) => {
    try {
      setLoading(true)
      // Update the lastUpdate field
      const updatedData = {
        ...newData,
        lastUpdate: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
      }
      
      await writeProductCategories(updatedData)
      setProductData(updatedData)
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

  // Function to update a specific category
  const updateCategory = async (categoryId, updatedCategory) => {
    const newData = { ...productData }
    
    // Find and update in baseCategories
    const baseIndex = newData.baseCategories.findIndex(cat => cat.id === categoryId)
    if (baseIndex !== -1) {
      newData.baseCategories[baseIndex] = {
        ...newData.baseCategories[baseIndex],
        ...updatedCategory
      }
      return await saveProductData(newData)
    }
    
    // Find and update in customCategories
    const customIndex = newData.customCategories.findIndex(cat => cat.id === categoryId)
    if (customIndex !== -1) {
      newData.customCategories[customIndex] = {
        ...newData.customCategories[customIndex],
        ...updatedCategory
      }
      return await saveProductData(newData)
    }
    
    return false
  }

  // Value object to be provided to consumers
  const value = {
    productData,
    loading,
    error,
    loadProductData,
    saveProductData,
    updateCategory
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}
