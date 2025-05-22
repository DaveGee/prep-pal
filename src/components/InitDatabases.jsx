import { useState } from 'react'
import { useLittera } from '@assembless/react-littera'
import { Box, Button, Text, Modal, Stack, FocusTrap, Group, NumberInput } from '@mantine/core'
import { useProductContext } from '../context/ProductContext'
import { setSaveStatus } from '../utils/notificationUtils'

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
  },
  cancel: {
    fr_CH: "Annuler",
    de_CH: "Abbrechen",
    en_US: "Cancel"
  },
  save: {
    fr_CH: "Envoyer",
    de_CH: "Einreichen",
    en_US: "Submit"
  },
  initDatabasesHowTo: {
    fr_CH: "Pour démarrer, indiquez le nombre de personnes et le nombre moyen de jours pour lesquels vous souhaitez gérer votre stock.",
    de_CH: "Um zu beginnen, geben Sie die Anzahl der Personen und die durchschnittliche Anzahl der Tage an, für die Sie Ihren Bestand verwalten möchten.",
    en_US: "To get started, please indicate the number of people and the average number of days you want to manage your stock."
  },
  nbPeople: {
    fr_CH: "Nombre de personnes dans le foyer",
    de_CH: "Anzahl der Personen im Haushalt",
    en_US: "Number of people in the household"
  },
  nbPeopleDescription: {
    fr_CH: "Enter a number between 1 and 10",
    de_CH: "Geben Sie eine Zahl zwischen 1 und 10 ein",
    en_US: "Enter a number between 1 and 10"
  },
  nbDays: {
    fr_CH: "Nombre de jours",
    de_CH: "Anzahl der Tage",
    en_US: "Number of days"
  },
  nbDaysDescription: {
    fr_CH: "Enter a number between 7 and 90",
    de_CH: "Geben Sie eine Zahl zwischen 7 und 90 ein",
    en_US: "Enter a number between 7 and 90"
  },
  failedInitializingData: {
    fr_CH: "Échec de l'initialisation des données",
    de_CH: "Fehler bei der Initialisierung der Daten",
    en_US: "Failed to initialize data"
  },
  initializingDatabases: {
    fr_CH: "Initialisation de la base de donnée",
    de_CH: "Initialisierung der Datenbank",
    en_US: "Initializing database"
  },
  successInitializingDatabases: {
    fr_CH: "Initialisation de la base de données terminée",
    de_CH: "Initialisierung der Datenbank abgeschlossen",
    en_US: "Database initialization completed"
  }
}

function InitDatabases() {
  const [initModalOpened, setInitModalOpened] = useState(false)
  const [nbPeople, setNbPeople] = useState(1)
  const [nbDays, setNbDays] = useState(7)
  const translated = useLittera(translations)
  const { initializeData } = useProductContext()

  const handleSubmit = async () => {
    setSaveStatus({
      saving: true,
      success: false,
      message: translated.initializingDatabases,
      id: 'init-category'
    })
    const success = await initializeData(nbPeople, nbDays)

    if (success) {
      setNbDays(7)
      setNbPeople(1)
      setSaveStatus({
        saving: false,
        success: true,
        message: translated.successInitializingDatabases,
        id: 'init-category'
      })
    } else {
      console.error("Something went wrong while initializing data")
      setSaveStatus({
        saving: false,
        success: false,
        message: translated.failedInitializingData,
        id: 'init-category'
      })
    }
    setInitModalOpened(false)
  }

  const areInputsValid = () => {
    return nbPeople >= 1 && nbPeople <= 10 && nbDays >= 7 && nbDays <= 90
  }

  return (
    <>
      <Box>
        <Text my="xs">{translated.noFileFound}</Text>
        <Button my="xs" color="blue" onClick={() => setInitModalOpened(true)}>
          {translated.initDatabases}
        </Button>
      </Box>
      
      {initModalOpened && (
        <Modal 
          opened={true} 
          onClose={() => setInitModalOpened(false)} 
          title={translated.initDatabases}
          size="md"
        >
          <Stack spacing="md">
            <FocusTrap active={true}>
              <Text size="sm" c="dimmed">
                {translated.initDatabasesHowTo}
              </Text>
              
              <NumberInput
                label={translated.nbPeople}
                description={translated.nbPeopleDescription}
                value={nbPeople}
                onChange={setNbPeople}
                min={1}
                max={10}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && areInputsValid()) {
                    handleSubmit();
                  }
                }}
                withAsterisk
                required
                data-autofocus
              />
              
              <NumberInput
                label={translated.nbDays}
                description={translated.nbDaysDescription}
                value={nbDays}
                onChange={setNbDays}
                min={7}
                max={90}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && areInputsValid()) {
                    handleSubmit();
                  }
                }}
                withAsterisk
                required
              />

            </FocusTrap>
            
            <Group position="right" mt="md">
              <Button variant="outline" onClick={() => setInitModalOpened(false)}>{translated.cancel}</Button>
              <Button onClick={handleSubmit} disabled={!areInputsValid()}>
                {translated.save}
              </Button>
            </Group>
          </Stack>
        </Modal>
      )}
    </>

  )
}

export default InitDatabases
