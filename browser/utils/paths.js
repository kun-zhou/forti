import { remote } from 'electron'
const path = require('path')

export const pathConfigDir = path.join(remote.app.getPath('appData'), 'Forti')
export const pathConfig = path.join(pathConfigDir, 'config.json')
export const appPath = remote.app.getAppPath()
export const pathInitialization = path.join(appPath, 'assets', 'user_content_dir')
export const pathCacheTemplate = path.join(appPath, 'assets', 'default_dbs', 'cache.json')