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
import { useLittera } from '@assembless/react-littera'

const translations = {
  addItemToStock: {
    fr_CH: (categoryName) => `Ajouter un nouvel article à votre stock dans la catégorie ${categoryName}.`,
    de_CH: (categoryName) => `Fügen Sie einen neuen Artikel zu Ihrem Bestand in der Kategorie ${categoryName} hinzu.`,
    en_US: (categoryName) => `Add a new item to your stock in the ${categoryName} category.`
  },
  productName: {
    fr_CH: "Nom du produit",
    de_CH: "Produktname",
    en_US: "Product name"
  },
  onlineStoreLink: {
    fr_CH: "Lien vers la boutique en ligne (facultatif)",
    de_CH: "Link zum Online-Shop (optional)",
    en_US: "Online store link (optional)"
  },
  quantity: {
    fr_CH: "Quantité",
    de_CH: "Menge",
    en_US: "Quantity"
  },
  addToCategory: {
    fr_CH: (categoryName) => `Ajouter un article à ${categoryName}`,
    de_CH: (categoryName) => `Artikel zu ${categoryName} hinzufügen`,
    en_US: (categoryName) => `Add item to ${categoryName}`
  },
  save: {
    fr_CH: "Enregistrer",
    de_CH: "Speichern",
    en_US: "Save"
  },
  cancel: {
    fr_CH: "Annuler",
    de_CH: "Abbrechen",
    en_US: "Cancel"
  },
  errorAddingItem: {
    fr_CH: (message) => `Erreur lors de l'ajout de l'article : ${message}`,
    de_CH: (message) => `Fehler beim Hinzufügen des Artikels: ${message}`,
    en_US: (message) => `Error adding item: ${message}`
  },
  itemAdded: {
    fr_CH: (description, categoryName) => `Ajout de ${description} à ${categoryName}...`,
    de_CH: (description, categoryName) => `Hinzufügen von ${description} zu ${categoryName}...`,
    en_US: (description, categoryName) => `Adding ${description} to ${categoryName}...`
  },
  itemAddFailed: {
    fr_CH: (description, categoryName) => `Échec de l'ajout de ${description} à ${categoryName}`,
    de_CH: (description, categoryName) => `Fehler beim Hinzufügen von ${description} zu ${categoryName}`,
    en_US: (description, categoryName) => `Failed to add ${description} to ${categoryName}`
  },
  itemAddedToCategory: {
    fr_CH: (description, categoryName) => `${description} a été ajouté avec succès à ${categoryName}`,
    de_CH: (description, categoryName) => `${description} wurde erfolgreich zu ${categoryName} hinzugefügt`,
    en_US: (description, categoryName) => `${description} was successfully added to ${categoryName}` 
  },
  productNamePlaceholder: {
    fr_CH: "Entrez le nom du produit",
    de_CH: "Produktname eingeben",
    en_US: "Enter product name"
  },
  quantityPlaceholder: {
    fr_CH: "Entrez la quantité",
    de_CH: "Menge eingeben",
    en_US: "Enter quantity"
  }
}

function AddStockItemModal({ opened, onClose, categoryId, categoryName }) {
  const [description, setDescription] = useState('')
  const [onlineStoreLink, setOnlineStoreLink] = useState('')
  const [quantity, setQuantity] = useState(1)
  const { productData, saveStockData } = useProductContext()
  
  const translated = useLittera(translations)

  const handleSubmit = async () => {
    try {
      setSaveStatus({ 
        saving: true, 
        success: null, 
        message: translated.itemAdded(description, categoryName),
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
          ? translated.itemAddedToCategory(description, categoryName)
          : translated.itemAddFailed(description, categoryName),
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
        message: translated.errorAddingItem(error.message),
        id: 'save-stock-item'
      })
    }
  }

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={translated.addToCategory(categoryName)}
      size="md"
    >
      <Stack spacing="md">
        <Text size="sm" c="dimmed">
          {translated.addItemToStock(categoryName)}
        </Text>
        
        <TextInput
          label={translated.productName}
          placeholder={translated.productNamePlaceholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        
        <TextInput
          label={translated.onlineStoreLink}
          placeholder="https://..."
          value={onlineStoreLink}
          onChange={(e) => setOnlineStoreLink(e.target.value)}
        />
        
        <NumberInput
          label={translated.quantity}
          placeholder={translated.quantityPlaceholder}
          value={quantity}
          onChange={setQuantity}
          min={1}
          required
        />
        
        <Group position="right" mt="md">
          <Button variant="outline" onClick={onClose}>{translated.cancel}</Button>
          <Button onClick={handleSubmit} disabled={!description || quantity < 1}>
            {translated.save}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default AddStockItemModal
