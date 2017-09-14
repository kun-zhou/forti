// Using Object destructing to load modules
const { app, BrowserWindow } = require('electron')
const path = require('path')
// Keep a reference to mainWindow to avoid window object being garbadged collected
let mainWindow

/* * * * * * * * * * *
 * * Bootstrapping * *
 * * * * * * * * * * */

// Create main window when ready
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', whenAllWindowsClosed)

// Re-create window on activation (macOS only)
app.on('activate', whenActivated)

/* * * * * * * * * * * *
 * * Define Functions  *
 * * (using hoisting)  *
 * * * * * * * * * * * */
function createWindow() {

  // new Window
  mainWindow = new BrowserWindow({
    width: 1000, height: 600, minWidth: 600, minHeight: 300,
    titleBarStyle: "hidden-inset"
  })

  // load loading.html
  mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

//mainWindow.webContents.openDevTools()
  // save before close
  // on close
  mainWindow.on('closed', function () { mainWindow = null })
  /*const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

  installExtension(REACT_DEVELOPER_TOOLS).then((name) => {
    console.log(`Added Extension:  ${name}`)
  })
    .catch((err) => {
      console.log('An error occurred: ', err)
    })
  l*/
}

function whenAllWindowsClosed() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
}

function whenActivated() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
}
