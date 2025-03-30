import React, { useMemo, useState } from 'react'
import { Container, Title, Table, Loader, Tooltip, useMantineTheme, ActionIcon, Group, Anchor, Text } from '@mantine/core'
import { useProductContext } from '../context/ProductContext'
import { Biohazard, CalendarCheck, Trash, Info, Warning, PlusCircle, WarningDiamond } from '@phosphor-icons/react'
import { isTodayAfter } from '../utils/dateUtils'
import AddStockItemModal from '../components/AddStockItemModal'
import { setSaveStatus } from '../utils/notificationUtils'

function CurrentScreen() {
  const theme = useMantineTheme()
  const { productData, loading, saveStockData } = useProductContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  
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
                          { productType: 'Unknown Category', id: item.typeId }
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
  }, [productData.stock, productData.baseCategories])
  
  const handleAddItem = (category) => {
    setSelectedCategory(category)
    setModalOpen(true)
  }
  
  const handleDeleteItem = async (item, categoryName) => {
    try {
      setSaveStatus({ 
        saving: true, 
        success: null, 
        message: `Deleting ${item.description} from ${categoryName}...`,
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
          ? `${item.description} was successfully deleted from ${categoryName}` 
          : `Failed to delete ${item.description} from ${categoryName}`,
        id: 'save-stock-item'
      })
    } catch (error) {
      setSaveStatus({ 
        saving: false, 
        success: false, 
        message: `Error deleting item: ${error.message}`,
        id: 'save-stock-item'
      })
    }
  }
  
  // Generate table rows
  const rows = useMemo(() => {
    const tableRows = []
    
    groupedStockItems.forEach(group => {
      const categoryQuantity = group.category.quantityOverride || group.category.quantity
      const hasLowStock = group.totalQuantity < categoryQuantity

      // Add category row
      tableRows.push(
        <Table.Tr key={`category-${group.category.id}`} style={{ borderTop: `1px solid var(--mantine-color-blue-1)` }}>
          <Table.Td colSpan={2}>
            <Text fw={700} c="blue.4">{group.category.productType}</Text>
            <Text c="dimmed" size='xs'>{group.category.description}</Text>
          </Table.Td>
          <Table.Td>
            <Group gap="xs" wrap='nowrap'>
              {group.category.usualExpiryCheckDays && (
                <Tooltip label={"Average days to expire: " + (group.category.usualExpiryCheckDays || 'Not set')}>
                  <Info size={24} color={theme.colors.blue[9]} />
                </Tooltip>
              )}
              
              {hasLowStock && (
                <Tooltip label={`Stock level: ${group.stockPercentage}% (${group.totalQuantity}/${categoryQuantity})`}>
                  <WarningDiamond size={24} color={theme.colors.red[9]} weight="fill" />
                </Tooltip>
              )}
            </Group>
          </Table.Td>
          <Table.Td>{categoryQuantity}</Table.Td>
          <Table.Td>
            <Tooltip label={`Add item to ${group.category.productType}`}>
              <ActionIcon 
                variant="transparent"
                onClick={() => handleAddItem(group.category)}
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
            <Table.Td>{item.description}</Table.Td>
            <Table.Td>
              {item.onlineStoreLink && (
                <Anchor size="sm" href={item.onlineStoreLink} target="_blank" rel="noopener noreferrer">
                  {item.onlineStoreLink}
                </Anchor>
              )}
            </Table.Td>
            <Table.Td>
              <Group gap="xs" wrap='nowrap'>
                {isTodayAfter(item.computedExpiry) && (
                  <Tooltip label={"Check expiration date! (" + item.computedExpiry + ")"}>
                    <Biohazard size={24} color={theme.colors.orange[9]} />
                  </Tooltip>
                )}
                {isTodayAfter(item.computedNextCheck) ? (
                  <Tooltip label={"Check stock! (" + item.computedNextCheck + ")"}>
                    <Warning size={24} color={theme.colors.yellow[7]} />
                  </Tooltip>
                ) : (
                  <Tooltip label={"Next recommended check: " + item.computedNextCheck}>
                    <CalendarCheck size={24} color={theme.colors.teal[9]} />
                  </Tooltip>
                )}
              </Group>
            </Table.Td>
            <Table.Td>{item.quantity}</Table.Td>
            <Table.Td>
              <Tooltip label={`Delete ${item.description}`}>
                <ActionIcon 
                  variant="transparent"
                  onClick={() => handleDeleteItem(item, group.category.productType)}
                  color="gray"
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
  }, [groupedStockItems, theme.colors])

  return (
    <Container fluid>
      <Title order={1} mb="md">My current stock</Title>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Loader size="xl" />
        </div>
      ) : (
        <Table withRowBorders={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Product</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Actions</Table.Th>
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
    </Container>
  )
}

export default CurrentScreen
