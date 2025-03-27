const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')

// Get the app's user data directory (specific to your app)
const userDataPath = app.getPath('userData')
console.log('User Data Directory:', userDataPath)

// Path to the product categories JSON file
const productCategoriesPath = path.join(userDataPath, 'productCategories.json')

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
      : `file://${path.join(__dirname, '../build/index.html')}`
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
