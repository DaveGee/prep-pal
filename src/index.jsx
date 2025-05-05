import React from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import App from './App'
import { LitteraProvider } from '@assembless/react-littera'
import ErrorFallbackUI from './components/ErrorFallbackUI'
import '@mantine/dates/styles.css'

const root = createRoot(document.getElementById('root'))

// Render error UI
const renderErrorUI = (error) => {
  root.render(
    <React.StrictMode>
      <MantineProvider>
        <LitteraProvider locales={["fr_CH", "de_CH", "en_US"]} detectLocale={true} initialLocale="en_US">
          <ErrorFallbackUI error={error} />
        </LitteraProvider>
      </MantineProvider>
    </React.StrictMode>
  )
}

// For synchronous errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error)
  renderErrorUI(event.error)
})

// For promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  renderErrorUI(event.reason)
})

root.render(
  <React.StrictMode>
    <MantineProvider>
      <LitteraProvider locales={["fr_CH", "de_CH", "en_US"]} detectLocale={true} initialLocale="en_US">
        <Notifications />
        <App />
      </LitteraProvider>
    </MantineProvider>
  </React.StrictMode>
);
