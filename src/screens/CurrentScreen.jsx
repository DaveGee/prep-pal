import React, { useMemo, useState } from 'react'
import { Container, Title, Table, Loader, Tooltip, useMantineTheme, ActionIcon, Group, Text, NumberInput } from '@mantine/core'
import InitDatabases from '../components/InitDatabases'
import { useDebouncedCallback } from '@mantine/hooks'
import { useProductContext } from '../context/ProductContext'
import { Biohazard, CalendarCheck, Trash, Info, Warning, PlusCircle, WarningDiamond } from '@phosphor-icons/react'
import { isTodayAfter } from '../utils/dateUtils'
import AddStockItemModal from '../components/AddStockItemModal'
import { setSaveStatus } from '../utils/notificationUtils'
import { useLittera } from '@assembless/react-littera'
import ResetDatabases from '../components/ResetDatabases'

const translations = {
  title: {
    fr_CH: "Stock actuel",
    de_CH: "Aktueller Bestand",
    en_US: "Current stock"
  },
  updatingQuantity: (itemDescription) => ({
    fr_CH: `Mise à jour de la quantité pour ${itemDescription}...`,
    de_CH: `Aktualisierung der Menge für ${itemDescription}...`,
    en_US: `Updating quantity for ${itemDescription}...`,
  }),
  quantityUpdated: (itemDescription) => ({
    fr_CH: `Quantité pour ${itemDescription} mise à jour avec succès`,
    de_CH: `Menge für ${itemDescription} erfolgreich aktualisiert`,
    en_US: `Quantity for ${itemDescription} updated successfully`,
  }),
  quantityNotUpdated: (itemDescription) => ({
    fr_CH: `Échec de la mise à jour de la quantité pour ${itemDescription}`,
    de_CH: `Fehler beim Aktualisieren der Menge für ${itemDescription}`,
    en_US: `Failed to update quantity for ${itemDescription}`,
  }),
  errorUpdatingQuantity: (errorMessage) => ({
    fr_CH: `Erreur lors de la mise à jour de la quantité : ${errorMessage}`,
    de_CH: `Fehler beim Aktualisieren der Menge: ${errorMessage}`,
    en_US: `Error updating quantity: ${errorMessage}`,
  }),
  unknownCategory: {
    fr_CH: "Catégorie inconnue",
    de_CH: "Unbekannte Kategorie",
    en_US: "Unknown category"
  },
  deletingItem: (itemDescription, categoryName) => ({
    fr_CH: `Suppression de ${itemDescription} de ${categoryName}...`,
    de_CH: `Löschen von ${itemDescription} aus ${categoryName}...`,
    en_US: `Deleting ${itemDescription} from ${categoryName}...`,
  }),
  itemDeleted: (itemDescription, categoryName) => ({
    fr_CH: `${itemDescription} supprimé de ${categoryName} avec succès`,
    de_CH: `${itemDescription} erfolgreich aus ${categoryName} gelöscht`,
    en_US: `${itemDescription} deleted from ${categoryName} successfully`,
  }),
  itemNotDeleted: (itemDescription, categoryName) => ({
    fr_CH: `Échec de la suppression de ${itemDescription} de ${categoryName}`,
    de_CH: `Fehler beim Löschen von ${itemDescription} aus ${categoryName}`,
    en_US: `Failed to delete ${itemDescription} from ${categoryName}`,
  }),
  errorDeleting: (errorMessage) => ({
    fr_CH: `Erreur lors de la suppression de l'élément : ${errorMessage}`,
    de_CH: `Fehler beim Löschen des Elements: ${errorMessage}`,
    en_US: `Error deleting item: ${errorMessage}`,
  }),
  stockLevel: (stockPercentage, totalQuantity, categoryQuantity) => ({
    fr_CH: `Niveau de stock : ${stockPercentage}% (${totalQuantity}/${categoryQuantity})`,
    de_CH: `Bestandsniveau: ${stockPercentage}% (${totalQuantity}/${categoryQuantity})`,
    en_US: `Stock level: ${stockPercentage}% (${totalQuantity}/${categoryQuantity})`,
  }),
  averageExpiration: (days) => ({
    fr_CH: "Moyenne des jours avant expiration : " + (days || 'Non défini'),
    de_CH: "Durchschnittliche Tage bis zum Ablauf: " + (days || 'Nicht festgelegt'),
    en_US: "Average days to expire: " + (days || 'Not set'),
  }),
  addItem: (productType) => ({
    fr_CH: `Ajouter un article à ${productType}`,
    de_CH: `Artikel zu ${productType} hinzufügen`,
    en_US: `Add item to ${productType}`
  }),
  checkExpiration: (computedExpiry) => ({
    fr_CH: `Vérifier l'expiration (${computedExpiry})`,
    de_CH: `Ablaufdatum überprüfen (${computedExpiry})`,
    en_US: `Check expiration (${computedExpiry})`,
  }),
  checkStock: (computedNextCheck) => ({
    fr_CH: `Vérifier le stock (${computedNextCheck})`,
    de_CH: `Bestand überprüfen (${computedNextCheck})`,
    en_US: `Check stock (${computedNextCheck})`
  }),
  nextCheck: (computedNextCheck) => ({
    fr_CH: `Prochain contrôle recommandé (${computedNextCheck})`,
    de_CH: `Nächste empfohlene Überprüfung (${computedNextCheck})`,
    en_US: `Next recommened check (${computedNextCheck})`
  }),
  product: {
    fr_CH: "Produit",
    de_CH: "Produkt",
    en_US: "Product"
  },
  quantity: {
    fr_CH: "Quantité",
    de_CH: "Menge",
    en_US: "Quantity"
  },
  delete: (itemDescription) => ({
    fr_CH: `Supprimer ${itemDescription}`,
    de_CH: `Löschen ${itemDescription}`,
    en_US: `Delete ${itemDescription}`,
  }),
}

const LOW_STOCK_THRESHOLD = 65
const CRITICAL_STOCK_THRESHOLD_ = 35

function CurrentScreen() {
  const theme = useMantineTheme()
  const { filesExist, productData, loading, saveStockData } = useProductContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const translated = useLittera(translations)
  
  // Handle quantity change with debounce
  const handleQuantityChange = (item, newQuantity) => {
    try {
      setSaveStatus({ 
        saving: true, 
        success: null, 
        message: translated.updatingQuantity(item.description),
        id: 'save-stock-item'
      })
      
      // Update the item in the products array
      const updatedProducts = productData.stock.products.map(stockItem => {
        if (
          stockItem.typeId === item.typeId && 
          stockItem.description === item.description &&
          stockItem.checkedDate === item.checkedDate
        ) {
          return { ...stockItem, quantity: newQuantity }
        }
        return stockItem
      })
      
      // Create updated stock object
      const updatedStock = {
        ...productData.stock,
        products: updatedProducts
      }
      
      // Save the updated stock
      saveStockData(updatedStock).then(success => {
        setSaveStatus({ 
          saving: false, 
          success: success, 
          message: success 
            ? translated.quantityUpdated(item.description)
            : translated.quantityNotUpdated(item.description),
          id: 'save-stock-item'
        })
      })
    } catch (error) {
      setSaveStatus({ 
        saving: false, 
        success: false, 
        message: translated.errorUpdatingQuantity(error.message),
        id: 'save-stock-item'
      })
    }
  }
  
  // Debounced version of handleQuantityChange (500ms delay)
  const debouncedHandleQuantityChange = useDebouncedCallback(handleQuantityChange, 500)
  
  // Group stock items by typeId and include categories with non-zero quantity
  const groupedStockItems = useMemo(() => {
    if (!productData.baseCategories) {
      return []
    }
    
    // Create a map of all categories with non-zero quantity or override
    const grouped = {}
    
    // First, add all categories with non-zero quantity or override
    productData.baseCategories.forEach(category => {
      const quantity = category.quantityOverride || category.quantity
      if (quantity > 0) {
        grouped[category.id] = {
          category,
          items: []
        }
      }
    })
    
    // Then, add stock items to their respective categories
    if (productData.stock && productData.stock.products) {
      productData.stock.products.forEach(item => {
        // If the category doesn't exist yet (could be zero quantity), create it
        if (!grouped[item.typeId]) {
          const category = productData.baseCategories.find(cat => cat.id === item.typeId) || 
                          { productType: translated.unknownCategory, id: item.typeId }
          grouped[item.typeId] = {
            category,
            items: []
          }
        }
        
        // Add the item to its category
        grouped[item.typeId].items.push(item)
      })
    }
    
    // Calculate total quantity for each category
    Object.values(grouped).forEach(group => {
      group.totalQuantity = group.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
      
      const categoryQuantity = group.category.quantityOverride || group.category.quantity
      group.stockPercentage = categoryQuantity > 0 
        ? Math.round((group.totalQuantity / categoryQuantity) * 100) 
        : 100
    })
    
    // Convert to array and sort by category id
    return Object.values(grouped).sort((a, b) => a.category.id - b.category.id)
  }, [productData.stock, productData.baseCategories, translated])
  
  const handleAddItem = (category) => {
    setSelectedCategory(category)
    setModalOpen(true)
  }
  
  const handleDeleteItem = async (item, categoryName) => {
    try {
      setSaveStatus({ 
        saving: true, 
        success: null, 
        message: translated.deletingItem(item.description, categoryName),
        id: 'save-stock-item'
      })
      
      // Filter out the item to delete
      const updatedProducts = productData.stock.products.filter(
        stockItem => !(
          stockItem.typeId === item.typeId && 
          stockItem.description === item.description &&
          stockItem.checkedDate === item.checkedDate
        )
      )
      
      // Create updated stock object
      const updatedStock = {
        ...productData.stock,
        products: updatedProducts
      }
      
      // Save the updated stock
      const success = await saveStockData(updatedStock)
      
      setSaveStatus({ 
        saving: false, 
        success: success, 
        message: success 
          ? translated.itemDeleted(item.description, categoryName) 
          : translated.itemNotDeleted(item.description, categoryName), 
        id: 'save-stock-item'
      })
    } catch (error) {
      setSaveStatus({ 
        saving: false, 
        success: false, 
        message: translated.errorDeleting(error.message),//`Error deleting item: ${error.message}`,
        id: 'save-stock-item'
      })
    }
  }
  
  // Generate table rows
  const rows = useMemo(() => {
    const tableRows = []
    
    groupedStockItems.forEach(group => {
      const categoryQuantity = group.category.quantityOverride || group.category.quantity
      const hasLowStock = group.stockPercentage < LOW_STOCK_THRESHOLD
      const stockLevelColor = group.stockPercentage > LOW_STOCK_THRESHOLD ? 
        theme.colors.green[6] : 
        group.stockPercentage < CRITICAL_STOCK_THRESHOLD_ ?
          theme.colors.red[6] :
          theme.colors.yellow[6]

      // Add category row
      tableRows.push(
        <Table.Tr key={`category-${group.category.id}`} style={{ borderTop: `1px solid var(--mantine-color-blue-1)` }}>
          <Table.Td>
            <Group gap="xs" wrap='nowrap'>
              {hasLowStock && (
                <Tooltip label={translated.stockLevel(group.stockPercentage, group.totalQuantity, categoryQuantity)}>
                  <WarningDiamond size={24} color={stockLevelColor} weight="fill" />
                </Tooltip>
              )}
            </Group>
          </Table.Td>
          <Table.Td>
            <Group gap="xs">
            <Text fw={700} c="blue.4">{group.category.productType}</Text>
              {group.category.usualExpiryCheckDays && (
                <Tooltip label={translated.averageExpiration(group.category.usualExpiryCheckDays)}>
                  <Info color={theme.colors.blue[9]} size={18} />
                </Tooltip>
              )}
            </Group>
            <Text c="dimmed" size='xs'>{group.category.description}</Text>
          </Table.Td>
          <Table.Td>{categoryQuantity}</Table.Td>
          <Table.Td>
            <Tooltip label={translated.addItem(group.category.productType)}>
              <ActionIcon 
                variant="transparent"
                onClick={() => handleAddItem(group.category)}
                tabIndex="-1"
              >
                <PlusCircle size={24} />
              </ActionIcon>
            </Tooltip>
          </Table.Td>
        </Table.Tr>
      )
      
      // Add item rows
      group.items.forEach((item, index) => {
        tableRows.push(
          <Table.Tr key={`item-${group.category.id}-${index}`}>
            <Table.Td>
              <Group gap="xs" wrap='nowrap'>
                {isTodayAfter(item.computedExpiry) && (
                  <Tooltip label={translated.checkExpiration(item.computedExpiry)}>
                    <Biohazard size={24} color={theme.colors.orange[9]} />
                  </Tooltip>
                )}
                {isTodayAfter(item.computedNextCheck) ? (
                  <Tooltip label={translated.checkStock(item.computedNextCheck)}>
                    <Warning size={24} color={theme.colors.yellow[7]} />
                  </Tooltip>
                  ) : (
                  <Tooltip label={translated.nextCheck(item.computedNextCheck)}>
                    <CalendarCheck size={24} color={theme.colors.teal[9]} />
                  </Tooltip>
                )}
              </Group>
            </Table.Td>
            <Table.Td>
              <Group gap="xs">
                <Text>{item.description}</Text>
                <Text size="xs" c="dimmed">(checked: {item.checkedDate})</Text>
              </Group>
            </Table.Td>
            <Table.Td>
              <NumberInput
                variant="unstyled"
                size="xs"
                value={item.quantity || 0}
                onChange={(value) => debouncedHandleQuantityChange(item, value)}
                min={0}
                styles={{ input: { width: '80px' } }}
              />
            </Table.Td>
            <Table.Td>
              <Tooltip label={translated.delete(item.description)}>
                <ActionIcon 
                  variant="transparent"
                  onClick={() => handleDeleteItem(item, group.category.productType)}
                  color="gray"
                  tabIndex="-1"
                >
                  <Trash size={20} />
                </ActionIcon>
              </Tooltip>
            </Table.Td>
          </Table.Tr>
        )
      })
    })
    
    return tableRows
  }, [groupedStockItems, theme.colors, translated])

  return (
    <Container fluid>
      <Group gap="xs" mb="md" align="flex-start" justify='space-between'>
        <Title order={1}>{translated.title}</Title>
        <ResetDatabases />
      </Group>
      
      {filesExist.categories ? (
        <>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader size="xl" />
            </div>
          ) : (
            <Table withRowBorders={false}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th></Table.Th>
                  <Table.Th>{translated.product}</Table.Th>
                  <Table.Th>{translated.quantity}</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          )}
          
          {selectedCategory && (
            <AddStockItemModal
              opened={modalOpen}
              onClose={() => setModalOpen(false)}
              categoryId={selectedCategory.id}
              categoryName={selectedCategory.productType}
            />
          )}
        </>
      ) : (
        <InitDatabases />
      )}
    </Container>
  )
}

export default CurrentScreen
