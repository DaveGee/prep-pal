export default {
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
    checkStock: (nextCheckDate) => ({
      fr_CH: `Vérifier le stock (${nextCheckDate})`,
      de_CH: `Bestand überprüfen (${nextCheckDate})`,
      en_US: `Check stock (${nextCheckDate})`
    }),
    nextCheck: (nextCheckDate) => ({
      fr_CH: `Prochain contrôle recommandé (${nextCheckDate})`,
      de_CH: `Nächste empfohlene Überprüfung (${nextCheckDate})`,
      en_US: `Next recommended check (${nextCheckDate})`
    }),
    resetCheckedDate: {
      fr_CH: "Cliquez une fois de plus pour réinitialiser la date de vérification à aujourd'hui",
      de_CH: "Klicken Sie noch einmal, um das Prüfdatum auf heute zurückzusetzen",
      en_US: "Click once more to reset the checked date to today"
    },
    setupNextCheckDate: {
      fr_CH: "Cliquez à nouveau pour configurer la prochaine date de vérification / date d'expiration pour cet article",
      de_CH: "Klicken Sie erneut, um das nächste Prüfdatum / Ablaufdatum für diesen Artikel einzurichten",
      en_US: "Click again to setup the next check date / expiration date for this item"
    },
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
    itemsExpired: {
      fr_CH: "Articles potentiellement périmés dans cette catégorie",
      de_CH: "Artikel in dieser Kategorie möglicherweise abgelaufen",
      en_US: "Items potentially expired in this category",
    },
    updatingCheckedDate: (itemDescription) => ({
      fr_CH: `Mise à jour de la date de vérification pour ${itemDescription}...`,
      de_CH: `Aktualisierung des Prüfdatums für ${itemDescription}...`,
      en_US: `Updating checked date for ${itemDescription}...`,
    }),
    checkedDateUpdated: (itemDescription) => ({
      fr_CH: `Date de vérification pour ${itemDescription} mise à jour avec succès`,
      de_CH: `Prüfdatum für ${itemDescription} erfolgreich aktualisiert`,
      en_US: `Checked date for ${itemDescription} updated successfully`,
    }),
    checkedDateNotUpdated: (itemDescription) => ({
      fr_CH: `Échec de la mise à jour de la date de vérification pour ${itemDescription}`,
      de_CH: `Fehler beim Aktualisieren des Prüfdatums für ${itemDescription}`,
      en_US: `Failed to update checked date for ${itemDescription}`,
    }),
    errorUpdatingCheckedDate: (errorMessage) => ({
      fr_CH: `Erreur lors de la mise à jour de la date de vérification : ${errorMessage}`,
      de_CH: `Fehler beim Aktualisieren des Prüfdatums: ${errorMessage}`,
      en_US: `Error updating checked date: ${errorMessage}`,
    }),
  }
