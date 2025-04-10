import React, { useState, useEffect } from 'react'
import { Container, NumberInput, Table, Title, Text, Button, Group, Loader, Alert } from '@mantine/core'
import InitDatabases from '../components/InitDatabases'
import { useProductContext } from '../context/ProductContext'
import { useDebouncedCallback } from '@mantine/hooks'
import { setSaveStatus } from '../utils/notificationUtils'
import { useLittera } from '@assembless/react-littera'
import ResetDatabases from '../components/ResetDatabases'

const translations = {
  title: {
    fr_CH: "Catégories recommandées",
    de_CH: "Empfohlene Kategorien",
    en_US: "Recommended categories"
  },
  saveStatus: {
    fr_CH: "Enregistrement des modifications...",
    de_CH: "Änderungen speichern...",
    en_US: "Saving changes..."
  },
  saveSuccess: {
    fr_CH: "Modifications enregistrées avec succès",
    de_CH: "Änderungen erfolgreich gespeichert",
    en_US: "Changes saved successfully"
  },
  saveError: {
    fr_CH: "Erreur lors de l'enregistrement des modifications",
    de_CH: "Fehler beim Speichern der Änderungen",
    en_US: "Error saving changes"
  },
  errorSavingFile: {
    fr_CH: "Erreur lors de la sauvegarde du fichier",
    de_CH: "Fehler beim Speichern der Datei",
    en_US: "Error saving file"
  },
  lastUpdated: {
    fr_CH: "Dernière mise à jour :",
    de_CH: "Letzte Aktualisierung:",
    en_US: "Last updated:"
  },
  productType: {
    fr_CH: "Type de produit",
    de_CH: "Produktart",
    en_US: "Product type"
  },
  description: {
    fr_CH: "Description",
    de_CH: "Beschreibung",
    en_US: "Description"
  },
  quantity: {
    fr_CH: "Quantité",
    de_CH: "Menge",
    en_US: "Quantity"
  },
  override: {
    fr_CH: "Ajuster",
    de_CH: "Überschreiben",
    en_US: "Override"
  },
}

function RecommendedScreen() {
  const { filesExist, productData, loading, error, updateCategory } = useProductContext()
  const [data, setData] = useState([])

  const translated = useLittera(translations)

  // Update local state when productData changes
  useEffect(() => {
    if (productData && productData.baseCategories) {
      setData(productData.baseCategories)
    }
  }, [productData])

  // Update local state immediately without debounce
  const updateLocalState = (index, value, item) => {
    const updatedData = [...data]
    updatedData[index] = { ...item, quantityOverride: value }
    setData(updatedData)
  }
  
  // Handle quantity override change with debounce for saving to disk
  const saveChanges = async (index, value, item) => {
    try {
      setSaveStatus({ saving: true, success: null, message: translated.saveStatus, id: 'save-status' })
      
      const success = await updateCategory(item.id, { quantityOverride: value })
      setSaveStatus({ 
        saving: false, 
        success: success, 
        message: success ? translated.saveSuccess : translated.saveError,
        id: 'save-status'
      })
    } catch (err) {
      setSaveStatus({ saving: false, success: false, message: translated.saveError, id: 'save-status' })
    }
  }
  
  // Debounced version of saveChanges (500ms delay)
  const debouncedSaveChanges = useDebouncedCallback(saveChanges, 500)
  
  // Combined function to update state immediately and save with debounce
  const handleQuantityChange = (index, value, item) => {
    // Update local state immediately
    updateLocalState(index, value, item)
    
    // Save to disk with debounce
    debouncedSaveChanges(index, value, item)
  }

  const quantity = (item) => {
    if (item.quantityOverride || item.quantityOverride === 0) {
      return item.quantityOverride
    }
    return item.quantity
  }

  const overridenQuantity = (item) => {
    return (item.quantityOverride || item.quantityOverride === 0) && item.quantityOverride !== item.quantity
  }

  const rows = data.map((item, index) => (
    <Table.Tr key={item.productType}>
      <Table.Td>{item.productType}</Table.Td>
      <Table.Td>{item.description}</Table.Td>
      <Table.Td style={{ minWidth: '50px', maxWidth: '80px' }}>
        <NumberInput
          size="xs"
          value={quantity(item)}
          onChange={(value) => handleQuantityChange(index, value, item)}
        />
      </Table.Td>
      <Table.Td c="dimmed">
        {overridenQuantity(item) ? item.quantity : ""}
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Container fluid>
      <Group gap="xs" mb="md" align="flex-start" justify='space-between'>
        <Title order={1}>{translated.title}</Title>
        <ResetDatabases />
      </Group>
      
      {/* Show error message if there's an error */}
      {error && (
        <Alert color="red" title={translated.errorSavingFile} mb="md">
          {error}
        </Alert>
      )}

      {filesExist.categories ? (
        <>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader size="xl" />
            </div>
          ) : (
            <>
              {productData.lastCategoriesUpdate && (
                <Text size="sm" c="dimmed" mb="md">
                  {translated.lastUpdated} {new Date(productData.lastCategoriesUpdate).toLocaleDateString()}
                </Text>
              )}
              
              <Table withRowBorders={false} highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{translated.productType}</Table.Th>
                    <Table.Th>{translated.description}</Table.Th>
                    <Table.Th>{translated.quantity}</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </>
          )}
        </>
      ) : (
        <InitDatabases />
      )}
    </Container>
  )
}

export default RecommendedScreen
