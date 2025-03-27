import React from 'react'
import { AppShell, Burger, Group, Title, Image, NavLink } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { HashRouter, useLocation } from 'react-router-dom'
import AppRoutes from './Routes'
import { ProductProvider } from './context/ProductContext'

import SetupScreen from './screens/SetupScreen'
import RecommendedScreen from './screens/RecommendedScreen'
import CurrentScreen from './screens/CurrentScreen'
import ShoppingListScreen from './screens/ShoppingListScreen'

import { Gear, Star, List, ShoppingCart } from '@phosphor-icons/react'

import logo from './assets/logo.png'

const routes = [
  { label: 'Setup', icon: Gear, link: '/setup', component: SetupScreen },
  { label: 'Recommended', icon: Star, link: '/recommended', component: RecommendedScreen },
  { label: 'Current', icon: List, link: '/current', component: CurrentScreen },
  { label: 'Shopping list', icon: ShoppingCart, link: '/shopping-list', component: ShoppingListScreen }
]

function AppContent() {
  const [opened, { toggle, close }] = useDisclosure()
  const location = useLocation()
  
  // Close the burger menu when the location changes
  React.useEffect(() => {
    close()
  }, [location, close])

  return (
        <AppShell
          header={{ height: 100 }}
          navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" px="md">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Image fit="contain" w="60" src={logo} alt="Logo" style={{ verticalAlign: "middle", width: "60px" }} />
              <Title order={2}>                
                Manage my stock
              </Title>

            </Group>
          </AppShell.Header>
          <AppShell.Navbar p="md">
            {
              routes.map((route) => (
                <NavLink
                  href={"#" + route.link}
                  key={route.label}
                  label={route.label}
                  leftSection={<route.icon size={16} stroke={1.5} />}
                  active={location.pathname === route.link}
                />
              ))
            }
          </AppShell.Navbar>
          <AppShell.Main>
            <AppRoutes routes={routes} />
          </AppShell.Main>
        </AppShell>
  )
}

function App() {
  return (
    <ProductProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </ProductProvider>
  )
}

export default App
