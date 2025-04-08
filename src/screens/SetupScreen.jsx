import React from 'react'
import { useLittera } from '@assembless/react-littera'
import { Container, Divider, Title, Box, Button, Text } from '@mantine/core'
import { useProductContext } from '../context/ProductContext'

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
  },
  categoriesFile: {
    fr_CH: (date, count) => `Fichier des catégories (${date}, ${count} catégories)`,
    de_CH: (date, count) => `Kategorien-Datei (${date}, ${count} Kategorien)`,
    en_US: (date, count) => `Categories file (${date}, ${count} categories)`
  },
  productsFile: {
    fr_CH: (date, count) => `Fichier des produits (${date}, ${count} produits)`,
    de_CH: (date, count) => `Produktdatei (${date}, ${count} Produkte)`,
    en_US: (date, count) => `Products file (${date}, ${count} products)`
  },
  reset: {
    fr_CH: "Supprimer les bases de données",
    de_CH: "Datenbanken löschen",
    en_US: "Delete databases"
  },
  noFileFound: {
    fr_CH: "Aucun fichier trouvé",
    de_CH: "Keine Datei gefunden",
    en_US: "No file found"
  },
  initDatabases: {
    fr_CH: "Initialiser les bases de données",
    de_CH: "Datenbanken initialisieren",
    en_US: "Initialize databases"
  }
}

function SetupScreen() {
  const translated = useLittera(translations)
  const { 
    productData, 
    loading, 
    filesExist, 
    initializeData, 
    resetDatabases 
  } = useProductContext()

  // Both files need to exist for the setup to be considered complete
  const bothFilesExist = filesExist.categories && filesExist.stock
  
  // Get the date from the context or use current date as fallback
  const fileDate = productData.lastCategoriesUpdate 
    ? new Date(productData.lastCategoriesUpdate).toLocaleDateString() 
    : new Date().toLocaleDateString()
  
  // Get the actual counts from the context
  const categoriesCount = productData.baseCategories.length
  const productsCount = productData.stock.length

  // Handler for initializing databases
  const handleInitDatabases = async () => {
    await initializeData()
  }

  // Handler for resetting databases
  const handleResetDatabases = async () => {
    // Only delete the databases, don't initialize
    await resetDatabases()
  }

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
        <Box>
          <Text my="xs">{translated.categoriesFile(fileDate, categoriesCount)}</Text>
          <Text my="xs">{translated.productsFile(fileDate, productsCount)}</Text>
          <Button my="xs" color="red" onClick={handleResetDatabases}>
            {translated.reset}
          </Button>
        </Box>
      ) : (
        <Box>
          <Text my="xs">{translated.noFileFound}</Text>
          <Button my="xs" color="blue" onClick={handleInitDatabases}>
            {translated.initDatabases}
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default SetupScreen
