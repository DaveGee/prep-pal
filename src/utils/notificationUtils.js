import { notifications } from '@mantine/notifications'

/**
 * Shows or updates a save status notification
 * @param {Object} options - The notification options
 * @param {boolean} options.saving - Whether the save operation is in progress
 * @param {boolean|null} options.success - Whether the save operation was successful (null when saving)
 * @param {string} options.message - The notification message
 * @param {string} [options.id='save-status'] - The notification ID
 */
export const setSaveStatus = ({ saving, success, message, id = 'save-status' }) => {
  if (saving) {
    notifications.show({
      id,
      title: 'Saving',
      message,
      color: 'blue',
      withCloseButton: false,
      autoClose: false,
    })
  } else {
    notifications.update({
      id,
      title: (success ? 'Saved' : 'Error') + ' at ' + new Date().toLocaleTimeString(),
      message,
      color: success ? 'green' : 'red',
      withCloseButton: true,
      autoClose: 5000,
    })
  }
}
