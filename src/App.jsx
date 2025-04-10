import React from 'react'
import { Text, AppShell, Burger, Group, Title, Image, NavLink, UnstyledButton, Divider, Code, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { HashRouter, useLocation } from 'react-router-dom'
import AppRoutes from './Routes'
import { ProductProvider } from './context/ProductContext'

import SetupScreen from './screens/SetupScreen'
import RecommendedScreen from './screens/RecommendedScreen'
import CurrentScreen from './screens/CurrentScreen'
import ShoppingListScreen from './screens/ShoppingListScreen'

import { Gear, Package, JarLabel, ShoppingCart } from '@phosphor-icons/react'

import { useLittera, useLitteraMethods } from '@assembless/react-littera'

import logo from './assets/PrepPal.png'
import { version } from '../package.json'

const translations = {
  myStock: {
    fr_CH: "Mes réserves",
    de_CH: "Meine Vorräte",
    en_US: "My stock"
  },
  setup: {
    fr_CH: "Configuration",
    de_CH: "Einrichtung",
    en_US: "Setup"
  },
  categories: {
    fr_CH: "Catégories",
    de_CH: "Kategorien",
    en_US: "Categories"
  },
  manageStock: {
    fr_CH: "Gérer le stock",
    de_CH: "Bestand verwalten",
    en_US: "Manage stock"
  },
  shoppingList: {
    fr_CH: "Liste de courses",
    de_CH: "Einkaufsliste",
    en_US: "Shopping list"
  }
}

const routes = [
  { id: 'categories', icon: Package, link: '/recommended', component: RecommendedScreen },
  { id: 'manageStock', icon: JarLabel, link: '/current', component: CurrentScreen },
  { id: 'shoppingList', icon: ShoppingCart, link: '/shopping-list', component: ShoppingListScreen }
]

const localButtons = [
  { label: 'FR', locale: 'fr_CH' },
  { label: 'DE', locale: 'de_CH' },
  { label: 'EN', locale: 'en_US' }]

function AppContent() {
  const [opened, { toggle, close }] = useDisclosure()
  const location = useLocation()

  // Close the burger menu when the location changes
  React.useEffect(() => {
    close()
  }, [location, close])

  const translated = useLittera(translations)
  const methods = useLitteraMethods()

  const handleLocaleChange = locale => () => {
    methods.setLocale(locale)
  }

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
          <Title order={3}>
            {translated.myStock}
          </Title>

        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {
          routes.map((route) => (
            <NavLink
              href={"#" + route.link}
              key={route.id}
              label={translated[route.id]}
              leftSection={<route.icon size={16} stroke={1.5} />}
              active={location.pathname === route.link}
            />
          ))
        }

        <Stack justify='flex-end' h="100%" gap="xs">
          
          <Divider />
          <Group justify="center"><Code fw={700}>v{version}</Code></Group>
          <Group justify="center">
            {localButtons.map((button) => (
              <UnstyledButton
                key={button.locale}
                c={methods.locale === button.locale ? "blue" : "black"}
                onClick={handleLocaleChange(button.locale)}
              >
                <Text size="xs">{button.label}</Text>
              </UnstyledButton>
            ))}
          </Group>
        
        </Stack>
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
