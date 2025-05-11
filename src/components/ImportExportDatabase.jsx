import React from 'react'
import { Button, Tooltip, Group } from '@mantine/core'
import { BoxArrowDown, FileArrowUp } from '@phosphor-icons/react'
import { useLittera } from '@assembless/react-littera'
import { useProductContext } from '../context/ProductContext'

const translations = {
  download: {
    fr_CH: "Exporter les données",
    de_CH: "Daten exportieren",
    en_US: "Export data"
  },
  upload: {
    fr_CH: "Importer les données",
    de_CH: "Daten importieren",
    en_US: "Import data"
  }
}

function ImportExportDatabase() {
  const { 
    productData, 
    saveStockData, 
    saveProductCategoriesData,
    resetDatabases,
    checkFilesAndLoadData,
    filesExist
  } = useProductContext()
  
  // Check if databases are empty or reset
  const isDatabasesEmpty = !filesExist.categories || !filesExist.stock
  const fileInputRef = React.useRef(null)

  const translated = useLittera(translations)

  const handleExportData = () => {
    const exportData = {
      productCategories: {
        lastUpdate: productData.lastCategoriesUpdate,
        baseCategories: productData.baseCategories
      },
      stock: productData.stock
    }

    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `mystock-export-${new Date().toISOString().split('T')[0]}.json`
    
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    URL.revokeObjectURL(url)
  };

  // Function to validate the imported data (placeholder for future implementation)
  const validateImportedData = (data) => {
    // This is a placeholder function for future validation
    // For now, we'll just check if the basic structure exists
    return data && 
           data.productCategories && 
           data.productCategories.baseCategories && 
           data.stock
  }

  // Function to handle importing data
  const handleImportData = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Function to handle the file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        // Parse the JSON data
        const importedData = JSON.parse(e.target.result)
        
        // Validate the data (placeholder for now)
        if (!validateImportedData(importedData)) {
          console.error('Invalid import data format')
          return
        }
        
        try {
          await resetDatabases()
          
          const productCategories = {
            baseCategories: importedData.productCategories.baseCategories,
            lastUpdate: importedData.productCategories.lastUpdate || new Date().toISOString()
          }
          
          const categoriesSaved = await saveProductCategoriesData(productCategories)
          const stockSaved = await saveStockData(importedData.stock)
          
          if (categoriesSaved && stockSaved) {
            // Use checkFilesAndLoadData instead of loadProductData
            // This will check if files exist and update the filesExist state
            await checkFilesAndLoadData()
            
            console.log('Data imported successfully')
          } else {
            console.error('Failed to save imported data')
          }
        } catch (error) {
          console.error('Error during import process:', error)
        }
      } catch (error) {
        console.error('Error importing data:', error)
      }
      
      // Reset the file input
      event.target.value = null
    }
    
    reader.readAsText(file)
  }

  return (
    <Group justify="center">
      <Tooltip label={translated.download}>
        <Button 
          size="xs" 
          variant="subtle" 
          color="grey" 
          onClick={handleExportData}
          disabled={isDatabasesEmpty}
        >
          <BoxArrowDown size={20} />
        </Button>
      </Tooltip>
      <Tooltip label={translated.upload}>
        <Button size="xs" variant="subtle" color="grey" onClick={handleImportData}>
          <FileArrowUp size={20} />
        </Button>
      </Tooltip>
      {/* Hidden file input for importing data */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileSelect}
      />
    </Group>
  )
}

export default ImportExportDatabase
