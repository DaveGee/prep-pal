import React from 'react'
import { useLittera } from '@assembless/react-littera'
import { Container, Divider, Title, Text } from '@mantine/core'
import { useProductContext } from '../context/ProductContext'
import InitDatabases from '../components/InitDatabases'
import ResetDatabases from '../components/ResetDatabases'

const translations = {
  title: {
    fr_CH: "Configuration",
    de_CH: "Einrichtung",
    en_US: "Setup"
  },
  files: {
    fr_CH: "Fichiers",
    de_CH: "Dateien",
    en_US: "Databases"
  }
}

function SetupScreen() {
  const translated = useLittera(translations)
  const { 
    productData, 
    loading, 
    filesExist 
  } = useProductContext()

  // Both files need to exist for the setup to be considered complete
  const bothFilesExist = filesExist.categories && filesExist.stock
  
  // Get the date from the context or use current date as fallback
  const fileDate = productData.lastCategoriesUpdate 
    ? new Date(productData.lastCategoriesUpdate).toLocaleDateString() 
    : new Date().toLocaleDateString()
  
  const categoriesCount = productData.baseCategories.length
  const productsCount = productData.stock.products.length

  // If still loading, show a loading message
  if (loading) {
    return (
      <Container fluid>
        <Title order={1} mb="md">{translated.title}</Title>
        <Text>Loading...</Text>
      </Container>
    )
  }

  return (
    <Container fluid>
      <Title order={1} mb="md">{translated.title}</Title>
      <Divider />
      <Title order={3} mt="md">{translated.files}</Title>
      {bothFilesExist ? (
        <ResetDatabases 
          fileDate={fileDate} 
          categoriesCount={categoriesCount} 
          productsCount={productsCount} 
        />
      ) : (
        <InitDatabases />
      )}
    </Container>
  )
}

export default SetupScreen
