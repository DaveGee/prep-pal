import React from 'react'
import { Container } from '@mantine/core'
import Header from './components/Header'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './Routes'

function App() {
  return (
    <BrowserRouter>
      <Container size="md" py="xl">
        <Header />
        <AppRoutes />
      </Container>
    </BrowserRouter>
  )
}

export default App
