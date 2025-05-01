import React from 'react'
import { 
  Container, 
  Paper, 
  Title, 
  Text, 
  Button, 
  Group, 
  Stack, 
  Divider, 
  Code, 
  Center,
  Box
} from '@mantine/core'
import { Warning, ArrowClockwise } from '@phosphor-icons/react'
import { useLittera } from '@assembless/react-littera'

const translations = {
  somethingWentWrong: {
    fr_CH: "Quelque chose s'est mal passé",
    de_CH: "Etwas ist schief gelaufen",
    en_US: "Something went wrong"
  },
  errorMessage: {
    fr_CH: "L'application a rencontré une erreur inattendue et n'a pas pu continuer. Il s'agit probablement d'un problème temporaire qui peut être résolu en actualisant la page.",
    de_CH: "Die Anwendung ist auf einen unerwarteten Fehler gestoßen und konnte nicht fortfahren. Dies ist wahrscheinlich ein vorübergehendes Problem, das durch Aktualisieren der Seite behoben werden kann.",
    en_US: "The application encountered an unexpected error and couldn't continue. This is likely a temporary issue that can be resolved by refreshing the page."
  },
  errorDetails: {
    fr_CH: "Détails de l'erreur :",
    de_CH: "Fehlerdetails:",
    en_US: "Error details:"
  },
  stackTrace: {
    fr_CH: "Trace de la pile :",
    de_CH: "Stack-Trace:",
    en_US: "Stack trace:"
  },
  refreshPage: {
    fr_CH: "Actualiser la page",
    de_CH: "Seite aktualisieren",
    en_US: "Refresh Page"
  }
}

const ErrorFallbackUI = ({ error }) => {
  const errorMessage = error?.message || 'An unknown error occurred'
  const errorStack = error?.stack || ''
  
  const translated = useLittera(translations)
  
  return (
    <Center style={{ width: '100vw', height: '100vh' }}>
      <Container size="md" py="xl">
        <Paper p="xl" withBorder shadow="md" radius="md">
          <Stack spacing="md">
            <Group spacing="xs">
              <Warning size={28} color="red" weight="fill" />
              <Title order={2} color="red">{translated.somethingWentWrong}</Title>
            </Group>
            
            <Text size="lg">
              {translated.errorMessage}
            </Text>
            
            <Divider />
            
            <Box>
              <Text fw={700} size="sm" mb="xs">{translated.errorDetails}</Text>
              <Paper p="xs" withBorder bg="gray.0">
                <Code block>{errorMessage}</Code>
              </Paper>
              
              {errorStack && (
                <Box mt="md">
                  <Text fw={700} size="sm" mb="xs">{translated.stackTrace}</Text>
                  <Paper p="xs" withBorder bg="gray.0" style={{ maxHeight: '200px', overflow: 'auto' }}>
                    <Code block>{errorStack}</Code>
                  </Paper>
                </Box>
              )}
            </Box>
            
            <Group position="center" mt="md">
              <Button 
                color="blue" 
                leftIcon={<ArrowClockwise size={16} weight="bold" />}
                onClick={() => window.location.reload()}
              >
                {translated.refreshPage}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </Center>
  )
}

export default ErrorFallbackUI
