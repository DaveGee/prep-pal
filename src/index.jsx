import React from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import App from './App'
import { LitteraProvider } from '@assembless/react-littera'

const root = createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <MantineProvider>
      <LitteraProvider locales={[ "fr_CH", "de_CH", "en_US" ]} detectLocale={true} initialLocale="en_US">
        <Notifications />
        <App />
      </LitteraProvider>
    </MantineProvider>
  </React.StrictMode>
);
