export default {
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
  // New translations for the date picker modal
  setNextCheckDate: {
    fr_CH: "Définir la prochaine date de vérification",
    de_CH: "Nächstes Prüfdatum festlegen",
    en_US: "Set next check date"
  },
  selectNextCheckDate: (itemDescription) => ({
    fr_CH: `Sélectionnez la prochaine date de vérification pour ${itemDescription}`,
    de_CH: `Wählen Sie das nächste Prüfdatum für ${itemDescription}`,
    en_US: `Select the next check date for ${itemDescription}`
  }),
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
  updatingNextCheckDate: (itemDescription) => ({
    fr_CH: `Mise à jour de la prochaine date de vérification pour ${itemDescription}...`,
    de_CH: `Aktualisierung des nächsten Prüfdatums für ${itemDescription}...`,
    en_US: `Updating next check date for ${itemDescription}...`,
  }),
  nextCheckDateUpdated: (itemDescription) => ({
    fr_CH: `Prochaine date de vérification pour ${itemDescription} mise à jour avec succès`,
    de_CH: `Nächstes Prüfdatum für ${itemDescription} erfolgreich aktualisiert`,
    en_US: `Next check date for ${itemDescription} updated successfully`,
  }),
  nextCheckDateNotUpdated: (itemDescription) => ({
    fr_CH: `Échec de la mise à jour de la prochaine date de vérification pour ${itemDescription}`,
    de_CH: `Fehler beim Aktualisieren des nächsten Prüfdatums für ${itemDescription}`,
    en_US: `Failed to update next check date for ${itemDescription}`,
  }),
  errorUpdatingNextCheckDate: (errorMessage) => ({
    fr_CH: `Erreur lors de la mise à jour de la prochaine date de vérification : ${errorMessage}`,
    de_CH: `Fehler beim Aktualisieren des nächsten Prüfdatums: ${errorMessage}`,
    en_US: `Error updating next check date: ${errorMessage}`,
  }),
}
