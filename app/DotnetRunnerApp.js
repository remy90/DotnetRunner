const { BrowserWindow, Menu } = require('electron');
const { getApplications } = require('./applicationStore');

module.exports = class DotnetRunnerApp {
    /**
     * @param {typeof BrowserWindow} browserWindow
     * @param {typeof Menu} menu
     */
    constructor(browserWindow, menu) {
        
        /**
         * @type {typeof BrowserWindow}
         * @private
         */
        this._browserWindow = browserWindow;
        
        /**
         * 
         * @type {typeof Menu}
         * @private
         */
        this._menu = menu;

        /**
         * @type {BrowserWindow}
         * @private
         */
        this._mainWindow;
    }   

    /**
     * @private
     */
    _preferencesOnCLick() {
        const prefWindow = new BrowserWindow
        ({
            parent: this._mainWindow,
            modal: true,
          //  autoHideMenuBar: true
        });

        prefWindow.loadFile('app/browserWindows/dotnetAppConfiguration/appConfig.html');

        prefWindow.on('close', () => this._mainWindow.webContents.send('reload-data'));

        prefWindow.maximize();
    }

    /**
     * @private
     */
    _devToolsOnClick() {
        this._browserWindow.getFocusedWindow().toggleDevTools();
    }

    /**
     * 
     * @param {Object} template
     * @returns {Menu}
     */
    getMenu() {
        const template = [
            {
                label: 'Preferences',
                click: this._preferencesOnCLick.bind(this)
            }, 
            {
                label: 'Help',
                submenu: [{
                    label: 'Toggle Developer Tools',
                    accelerator: 'Ctrl+Shift+I',
                    click: this._devToolsOnClick.bind(this)
                }]
            }
        ];
    
       return this._menu.buildFromTemplate(template);
    }

    run() {
        this._mainWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true
            }
        });

        this._mainWindow.maximize();

        this._mainWindow.loadFile('app/index.html');

        this._menu.setApplicationMenu(this.getMenu());

        const eixstingApps = getApplications();

        if (!eixstingApps || eixstingApps.length === 0) {
            this._preferencesOnCLick();
        }
    }
}