import React from 'react'
import { useLittera } from '@assembless/react-littera'
import { Container, Divider, Title, Box, Button, Text } from '@mantine/core'

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
    fr_CH: "Réinitialiser les bases de données",
    de_CH: "Datenbanken zurücksetzen",
    en_US: "Reset databases"
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

  const filesExist = true // Placeholder for actual file existence check
  const fileDate = new Date().toLocaleDateString()
  const categoriesCount = 10 // Placeholder for actual count
  const productsCount = 20 // Placeholder for actual count

  return (
    <Container fluid>
      <Title order={1} mb="md">{translated.title}</Title>
      <Divider />
      <Title order={3} mt="md">{translated.files}</Title>
      {filesExist ? (
        <Box>
          <Text my="xs">{translated.categoriesFile(fileDate, categoriesCount)}</Text>
          <Text my="xs">{translated.productsFile(fileDate, productsCount)}</Text>
          <Button my="xs" color="red">{translated.reset}</Button>
        </Box>
      ) : (
        <Box>
          <Text my="xs">{translated.noFileFound}</Text>
          <Button my="xs" color="blue">{translated.initDatabases}</Button>
        </Box>
      )}
    </Container>
  )
}

export default SetupScreen
