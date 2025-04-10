import React from 'react'
import { useLittera } from '@assembless/react-littera'
import { Box, Button, Text } from '@mantine/core'
import { useProductContext } from '../context/ProductContext'

const translations = {
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

function InitDatabases() {
  const translated = useLittera(translations)
  const { initializeData } = useProductContext()

  const handleInitDatabases = async () => {
    await initializeData()
  }

  return (
    <Box>
      <Text my="xs">{translated.noFileFound}</Text>
      <Button my="xs" color="blue" onClick={handleInitDatabases}>
        {translated.initDatabases}
      </Button>
    </Box>
  )
}

export default InitDatabases
