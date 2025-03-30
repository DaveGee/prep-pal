import React, { useState } from 'react'
import { 
  Modal, 
  TextInput, 
  NumberInput, 
  Button, 
  Group, 
  Stack,
  Text
} from '@mantine/core'
import { useProductContext } from '../context/ProductContext'
import { getTodayFormatted, addDays } from '../utils/dateUtils'
import { setSaveStatus } from '../utils/notificationUtils'

function AddStockItemModal({ opened, onClose, categoryId, categoryName }) {
  const [description, setDescription] = useState('')
  const [onlineStoreLink, setOnlineStoreLink] = useState('')
  const [quantity, setQuantity] = useState(1)
  const { productData, saveStockData } = useProductContext()

  const handleSubmit = async () => {
    try {
      setSaveStatus({ 
        saving: true, 
        success: null, 
        message: `Adding ${description} to ${categoryName}...`,
        id: 'save-stock-item'
      })
      
      // Get the category to determine check days
      const category = productData.baseCategories.find(cat => cat.id === categoryId)
      const checkDays = category?.usualExpiryCheckDays || 90 // Default to 90 days if not specified
      
      // Create new stock item
      const newItem = {
        typeId: categoryId,
        description,
        quantity,
        onlineStoreLink: onlineStoreLink || '',
        checkedDate: getTodayFormatted(),
        nextCheck: addDays(getTodayFormatted(), checkDays),
        computedNextCheck: addDays(getTodayFormatted(), checkDays),
        computedExpiry: addDays(getTodayFormatted(), checkDays * 2) // Simple expiry calculation
      }
      
      // Add the new item to the stock
      const updatedStock = {
        ...productData.stock,
        products: [...productData.stock.products, newItem]
      }
      
      // Save the updated stock
      const success = await saveStockData(updatedStock)
      
      setSaveStatus({ 
        saving: false, 
        success: success, 
        message: success 
          ? `${description} was successfully added to ${categoryName}` 
          : `Failed to add ${description} to ${categoryName}`,
        id: 'save-stock-item'
      })
      
      if (success) {
        // Reset form and close modal
        setDescription('')
        setOnlineStoreLink('')
        setQuantity(1)
        onClose()
      }
    } catch (error) {
      setSaveStatus({ 
        saving: false, 
        success: false, 
        message: `Error adding item: ${error.message}`,
        id: 'save-stock-item'
      })
    }
  }

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={`Add item to ${categoryName}`}
      size="md"
    >
      <Stack spacing="md">
        <Text size="sm" c="dimmed">
          Add a new item to your stock in the {categoryName} category.
        </Text>
        
        <TextInput
          label="Product Name"
          placeholder="Enter product name"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        
        <TextInput
          label="Online Store Link (optional)"
          placeholder="https://..."
          value={onlineStoreLink}
          onChange={(e) => setOnlineStoreLink(e.target.value)}
        />
        
        <NumberInput
          label="Quantity"
          placeholder="Enter quantity"
          value={quantity}
          onChange={setQuantity}
          min={1}
          required
        />
        
        <Group position="right" mt="md">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!description || quantity < 1}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default AddStockItemModal
