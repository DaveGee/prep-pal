import React, { useMemo, useState } from 'react'
import { Container, Title, Table, Loader, Tooltip, useMantineTheme, ActionIcon, Group } from '@mantine/core'
import { useProductContext } from '../context/ProductContext'
import { Biohazard, CalendarCheck, Trash, Info, Warning, PlusCircle, WarningDiamond } from '@phosphor-icons/react'
import { isTodayAfter } from '../utils/dateUtils'
import AddStockItemModal from '../components/AddStockItemModal'

function CurrentScreen() {
  const theme = useMantineTheme()
  const { productData, loading } = useProductContext()
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
  
  // Generate table rows
  const rows = useMemo(() => {
    const tableRows = []
    
    groupedStockItems.forEach(group => {
      const categoryQuantity = group.category.quantityOverride || group.category.quantity
      const hasLowStock = group.totalQuantity < categoryQuantity

      // Add category row
      tableRows.push(
        <Table.Tr key={`category-${group.category.id}`} style={{ backgroundColor: hasLowStock ? theme.colors.orange[0] : theme.colors.gray[1] }} fw={500} tt="uppercase">
          <Table.Td>{group.category.productType}</Table.Td>
          <Table.Td c="dimmed">{group.category.description}</Table.Td>
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
                <a href={item.onlineStoreLink} target="_blank" rel="noopener noreferrer">
                  Buy Online
                </a>
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
            <Table.Td></Table.Td>
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
        <Table highlightOnHover>
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
