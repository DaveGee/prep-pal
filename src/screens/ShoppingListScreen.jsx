import React, { useState, useEffect } from 'react'
import { Container, Table, Title, Loader, Alert } from '@mantine/core'
import { Square, StackPlus, Tag, Hash } from '@phosphor-icons/react'
import { useProductContext } from '../context/ProductContext'
import classes from './ShoppingListScreen.module.css'

function ShoppingListScreen() {
  const { productData, loading, error } = useProductContext()
  const [shoppingListData, setShoppingListData] = useState([])

  // Calculate shopping list data when productData changes
  useEffect(() => {
    if (productData && productData.baseCategories && productData.stock) {
      // Create a map to store the sum of quantities for each category
      const categoryQuantities = {}
      
      // Initialize with all categories having 0 current quantity
      productData.baseCategories.forEach(category => {
        categoryQuantities[category.id] = 0
      })
      
      // Sum up quantities from stock items
      if (productData.stock.products) {
        productData.stock.products.forEach(stockItem => {
          if (categoryQuantities[stockItem.typeId] !== undefined) {
            categoryQuantities[stockItem.typeId] += stockItem.quantity
          }
        })
      }
      
      // Calculate shopping list with differences
      const shoppingList = productData.baseCategories.map(category => {
        const currentQuantity = categoryQuantities[category.id] || 0
        const desiredQuantity = category.quantityOverride || category.quantity
        const quantityToBuy = Math.max(0, desiredQuantity - currentQuantity)
        
        return {
          ...category,
          currentQuantity,
          quantityToBuy,
        }
      })
      
      setShoppingListData(shoppingList)
    }
  }, [productData])

  const rows = shoppingListData.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td><Square size="24" style={{ verticalAlign: 'middle' }} /></Table.Td>
      <Table.Td><strong>{item.quantityToBuy}</strong></Table.Td>
      <Table.Td>{item.productType}</Table.Td>
      <Table.Td c="dimmed">{item.defaultUnit}</Table.Td>
      <Table.Td c="dimmed">{item.description}</Table.Td>
    </Table.Tr>
  ))

  return (
    <Container fluid>
      <Title order={1} mb="md">Shopping List</Title>
      
      {/* Show error message if there's an error */}
      {error && (
        <Alert color="red" title="Error loading data" mb="md">
          {error}
        </Alert>
      )}
      
      {/* Show loading indicator */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Loader size="xl" />
        </div>
      ) : (
        <Table withRowBorders={false} className={classes.shoppingListTable}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th></Table.Th>
              <Table.Th><StackPlus size="18" /></Table.Th>
              <Table.Th><Tag size="18" /> Category</Table.Th>
              <Table.Th c="dimmed"><Hash size="18" /> Unit</Table.Th>
              <Table.Th c="dimmed">Description</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </Container>
  )
}

export default ShoppingListScreen
