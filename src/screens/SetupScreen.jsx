import React from 'react'
import { useLittera } from '@assembless/react-littera'

const translations = {
  setup: {
    fr_CH: "Configuration",
    de_CH: "Einrichtung",
    en_US: "Setup"
  }
}

function SetupScreen() {
  const translated = useLittera(translations)
  return (
    <div>
      <h1>{translated.setup}</h1>
      <p>This is the setup screen.</p>
    </div>
  )
}

export default SetupScreen
