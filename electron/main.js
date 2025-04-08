const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')

// Get the app's user data directory (specific to your app)
const userDataPath = app.getPath('userData')
console.log('User Data Directory:', userDataPath)

// Paths to JSON files
const productCategoriesPath = path.join(userDataPath, 'productCategories.json')
const stockPath = path.join(userDataPath, 'stock.json')

// IPC handler for reading product categories
ipcMain.handle('read-product-categories', async () => {
  try {
    const data = await fs.promises.readFile(productCategoriesPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading product categories:', error)
    throw error
  }
})

// IPC handler for writing product categories
ipcMain.handle('write-product-categories', async (event, data) => {
  try {
    const jsonData = JSON.stringify(data, null, 4)
    await fs.promises.writeFile(productCategoriesPath, jsonData, 'utf8')
    return true
  } catch (error) {
    console.error('Error writing product categories:', error)
    throw error
  }
})

// IPC handler for reading stock
ipcMain.handle('read-stock', async () => {
  try {
    const data = await fs.promises.readFile(stockPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading stock:', error)
    throw error
  }
})

// IPC handler for writing stock
ipcMain.handle('write-stock', async (event, data) => {
  try {
    const jsonData = JSON.stringify(data, null, 4)
    await fs.promises.writeFile(stockPath, jsonData, 'utf8')
    return true
  } catch (error) {
    console.error('Error writing stock:', error)
    throw error
  }
})

// IPC handler for deleting product categories
ipcMain.handle('delete-product-categories', async () => {
  try {
    // Check if file exists before attempting to delete
    if (fs.existsSync(productCategoriesPath)) {
      // Use synchronous delete instead of promises
      fs.unlinkSync(productCategoriesPath)
      console.log('Product categories file deleted successfully')
    } else {
      console.log('Product categories file does not exist, nothing to delete')
    }
    return true
  } catch (error) {
    console.error('Error deleting product categories:', error)
    throw error
  }
})

// IPC handler for deleting stock
ipcMain.handle('delete-stock', async () => {
  try {
    // Check if file exists before attempting to delete
    if (fs.existsSync(stockPath)) {
      // Use synchronous delete instead of promises
      fs.unlinkSync(stockPath)
      console.log('Stock file deleted successfully')
    } else {
      console.log('Stock file does not exist, nothing to delete')
    }
    return true
  } catch (error) {
    console.error('Error deleting stock:', error)
    throw error
  }
})

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // Load the index.html from a url
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../../dist/app/index.html')}`
  )

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools()
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
