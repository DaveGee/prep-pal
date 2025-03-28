import React, { useState, useEffect } from 'react'
import { Container, NumberInput, Table, Title, Text, Button, Group, Loader, Alert } from '@mantine/core'
import { useProductContext } from '../context/ProductContext'
import { useDebouncedCallback } from '@mantine/hooks'
import classes from './RecommendedScreen.module.css'
import { notifications } from '@mantine/notifications'

const setSaveStatus = ({ saving, success, message }) => {
  if (saving) {
    notifications.show({
      id: 'save-status',
      title: 'Saving',
      message: message,
      color: 'blue',
      withCloseButton: false,
      autoClose: false,
    })
  } else {
    notifications.update({
      id: 'save-status',
      title: (success ? 'Saved' : 'Error') + ' at ' + new Date().toLocaleTimeString(),
      message: message,
      color: success ? 'green' : 'red',
      withCloseButton: true,
      autoClose: 5000,
    })
  }
}

function RecommendedScreen() {
  const { productData, loading, error, updateCategory } = useProductContext()
  const [data, setData] = useState([])

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
      setSaveStatus({ saving: true, success: null, message: 'Saving changes...' })
      
      const success = await updateCategory(item.id, { quantityOverride: value })
      setSaveStatus({ 
        saving: false, 
        success: success, 
        message: success ? 'Changes saved successfully' : 'Failed to save changes' 
      })
    } catch (err) {
      setSaveStatus({ saving: false, success: false, message: 'Error saving changes' })
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

  const rows = data.map((item, index) => (
    <Table.Tr key={item.productType}>
      <Table.Td>{item.productType}</Table.Td>
      <Table.Td>{item.description}</Table.Td>
      <Table.Td>{item.quantity}</Table.Td>
      <Table.Td className={classes.overrideColumn}>
        <NumberInput
          value={item.quantityOverride || ''}
          onChange={(value) => handleQuantityChange(index, value, item)}
        />
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Container fluid>
      <Title order={1} mb="md">Recommended product to have stored</Title>
      
      {/* Show error message if there's an error */}
      {error && (
        <Alert color="red" title="Error saving file" mb="md">
          {error}
        </Alert>
      )}
      
      {/* Show loading indicator */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Loader size="xl" />
        </div>
      ) : (
        <>
          {productData.lastCategoriesUpdate && (
            <Text size="sm" color="dimmed" mb="md">
              Last updated: {productData.lastUpdate}
            </Text>
          )}
          
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product type</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th className={classes.overrideColumn}>Override</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </>
      )}
    </Container>
  )
}

export default RecommendedScreen
