import React from 'react'
import { AppShell, Burger, Group, NavLink, Title, Image } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { BrowserRouter } from 'react-router-dom'
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

function App() {

  const [opened, { toggle }] = useDisclosure();

  return (
    <ProductProvider>
      <BrowserRouter>
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
                  href={route.link}
                  key={route.label}
                  label={route.label}
                  leftSection={<route.icon size={16} stroke={1.5} />}
                  active={window.location.pathname === route.link}
                />
              ))
            }
          </AppShell.Navbar>
          <AppShell.Main>
            <AppRoutes routes={routes} />
          </AppShell.Main>
        </AppShell>
      </BrowserRouter>
    </ProductProvider>
  )
}

export default App
