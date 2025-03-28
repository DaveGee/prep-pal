import React, { useMemo } from 'react'
import { Container, Title, Table, Loader, Tooltip, useMantineTheme } from '@mantine/core'
import { useProductContext } from '../context/ProductContext'
import { Biohazard, CalendarCheck, Trash, Info, Warning } from '@phosphor-icons/react'
import { isTodayAfter } from '../utils/dateUtils'


function CurrentScreen() {
  const theme = useMantineTheme()
  const { productData, loading } = useProductContext()
  
  // Group stock items by typeId
  const groupedStockItems = useMemo(() => {
    if (!productData.stock || !productData.stock.products || !productData.baseCategories) {
      return []
    }
    
    // Create a map of typeId to category
    const categoryMap = {}
    productData.baseCategories.forEach(category => {
      categoryMap[category.id] = category
    })
    
    // Group stock items by typeId
    const grouped = {}
    productData.stock.products.forEach(item => {
      if (!grouped[item.typeId]) {
        grouped[item.typeId] = {
          category: categoryMap[item.typeId] || { productType: 'Unknown Category', id: item.typeId },
          items: []
        }
      }
      grouped[item.typeId].items.push(item)
    })
    
    // Convert to array and sort by category id
    return Object.values(grouped).sort((a, b) => a.category.id - b.category.id)
  }, [productData.stock, productData.baseCategories])
  
  // Generate table rows
  const rows = useMemo(() => {
    const tableRows = []
    
    groupedStockItems.forEach(group => {
      // Add category row
      tableRows.push(
        <Table.Tr key={`category-${group.category.id}`} style={{ backgroundColor: theme.colors.gray[1] }} fw={500} tt="uppercase">
          <Table.Td>{group.category.productType}</Table.Td>
          <Table.Td c="dimmed">{group.category.description}</Table.Td>
          <Table.Td>
            <Tooltip label={"Average days to expire: " + group.category.usualExpiryCheckDays}>
              <Info size={24} color={theme.colors.blue[9]} />
            </Tooltip>
          </Table.Td>
          <Table.Td>{group.category.quantityOverride || group.category.quantity}</Table.Td>
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
            </Table.Td>
            <Table.Td>{item.quantity}</Table.Td>
          </Table.Tr>
        )
      })
    })
    
    return tableRows
  }, [groupedStockItems])

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
              <Table.Th></Table.Th>
              <Table.Th></Table.Th>
              <Table.Th>Quantity</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </Container>
  )
}

export default CurrentScreen
