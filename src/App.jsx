import React from 'react'
import {
  Text,
  AppShell,
  Burger,
  Group,
  Title,
  Image,
  NavLink,
  UnstyledButton, Button,
  Divider,
  Code,
  Stack,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { HashRouter, useLocation } from 'react-router-dom'
import AppRoutes from './Routes'
import { ProductProvider } from './context/ProductContext'
import { UserProvider } from './context/UserContext'

import RecommendedScreen from './screens/RecommendedScreen'
import CurrentScreen from './screens/CurrentScreen'
import ShoppingListScreen from './screens/ShoppingListScreen'

import { Package, JarLabel, ShoppingCart, BoxArrowDown, FileArrowUp } from '@phosphor-icons/react'

import { useLittera, useLitteraMethods } from '@assembless/react-littera'

import logo from './assets/preppal-logo.png'
import { version } from '../package.json'
import { useProductContext } from './context/ProductContext'
import { useUserContext } from './context/UserContext'

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
  },
  download: {
    fr_CH: "Exporter les données",
    de_CH: "Daten exportieren",
    en_US: "Export data"
  },
  upload: {
    fr_CH: "Importer les données",
    de_CH: "Daten importieren",
    en_US: "Import data"
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
  const { 
    productData, 
    saveStockData, 
    saveProductCategoriesData,
    resetDatabases,
    checkFilesAndLoadData,
    filesExist
  } = useProductContext()
  
  const { userProfile, updateUserProfile } = useUserContext()

  // Check if databases are empty or reset
  const isDatabasesEmpty = !filesExist.categories || !filesExist.stock
  const fileInputRef = React.useRef(null)

  const translated = useLittera(translations)
  const methods = useLitteraMethods()

  // Close the burger menu when the location changes
  React.useEffect(() => {
    close()
  }, [location, close])
  
  // Set the language based on user profile when it loads
  React.useEffect(() => {
    if (userProfile && userProfile.preferredLanguage) {
      methods.setLocale(userProfile.preferredLanguage)
    }
  }, [userProfile, methods])

  const handleLocaleChange = locale => () => {
    methods.setLocale(locale)
    // Update user profile with the new preferred language
    updateUserProfile({ preferredLanguage: locale })
  }

  const handleExportData = () => {
    const exportData = {
      productCategories: {
        lastUpdate: productData.lastCategoriesUpdate,
        baseCategories: productData.baseCategories
      },
      stock: productData.stock
    }

    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `mystock-export-${new Date().toISOString().split('T')[0]}.json`
    
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    URL.revokeObjectURL(url)
  }

  // Function to validate the imported data (placeholder for future implementation)
  const validateImportedData = (data) => {
    // This is a placeholder function for future validation
    // For now, we'll just check if the basic structure exists
    return data && 
           data.productCategories && 
           data.productCategories.baseCategories && 
           data.stock
  }

  // Function to handle importing data
  const handleImportData = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Function to handle the file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        // Parse the JSON data
        const importedData = JSON.parse(e.target.result)
        
        // Validate the data (placeholder for now)
        if (!validateImportedData(importedData)) {
          console.error('Invalid import data format')
          return
        }
        
        try {
          await resetDatabases()
          
          const productCategories = {
            baseCategories: importedData.productCategories.baseCategories,
            lastUpdate: importedData.productCategories.lastUpdate || new Date().toISOString()
          }
          
          const categoriesSaved = await saveProductCategoriesData(productCategories)
          const stockSaved = await saveStockData(importedData.stock)
          
          if (categoriesSaved && stockSaved) {
            // Use checkFilesAndLoadData instead of loadProductData
            // This will check if files exist and update the filesExist state
            await checkFilesAndLoadData()
            
            console.log('Data imported successfully')
          } else {
            console.error('Failed to save imported data')
          }
        } catch (error) {
          console.error('Error during import process:', error)
        }
      } catch (error) {
        console.error('Error importing data:', error)
      }
      
      // Reset the file input
      event.target.value = null
    }
    
    reader.readAsText(file)
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
        <Stack gap="xs">
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
        
          <Divider />
          <Group justify="center">
            <Tooltip label={translated.download}>
              <Button 
                size="xs" 
                variant="subtle" 
                color="grey" 
                onClick={handleExportData}
                disabled={isDatabasesEmpty}
              >
                <BoxArrowDown size={20} />
              </Button>
            </Tooltip>
            <Tooltip label={translated.upload}>
              <Button size="xs" variant="subtle" color="grey" onClick={handleImportData}>
                <FileArrowUp size={20} />
              </Button>
            </Tooltip>
            {/* Hidden file input for importing data */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".json"
              onChange={handleFileSelect}
            />
          </Group>
        </Stack>

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
    </AppShell >
  )
}

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </ProductProvider>
    </UserProvider>
  )
}

export default App
