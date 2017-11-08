
const path = require('path')
const fs = require('fs')
export const pathConfigDir = path.join(require('electron').remote.app.getPath('appData'), 'lockit')
export const pathConfig = path.join(pathConfigDir, 'config.json')
export const pathInitialization = path.join('assets', 'user_content_dir')