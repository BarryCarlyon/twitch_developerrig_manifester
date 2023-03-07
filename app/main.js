const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const os = require('os');

const fs = require('fs');
const path = require('path');

const contextMenu = require('electron-context-menu');
contextMenu();

app.on('window-all-closed', () => {
    app.quit()
});

/*
not needed/doesn't work for MAS and not needed for mac.
Mac self enforces
and MAS has a fun permissions issue
*/
if (os.platform() == 'win32') {
    const gotLock = app.requestSingleInstanceLock();
    if (!gotLock) {
        app.quit();
    } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (win) {
                if (win.isMinimized()) {
                    win.restore();
                }
                win.focus();
            }
        });
    }
}

app.on('ready', () => {
    // settings migration
    let options = {
        width: 600,
        height: 800,
        x: 0,
        y: 0,

        show: false,

        title: `BarryCarlyon Twitch Developer Rig Manifester: v${app.getVersion()}`,
        autoHideMenuBar: false,
        backgroundColor: '#000000',

        maximizable: true,
        resizable: true,
        frame: true,

        webPreferences: {
            preload: path.join(app.getAppPath(), 'app', 'preload.js')
        }
    }

    win = new BrowserWindow(options);
    win.removeMenu();

    // on a display check
    let on_a_display = false;
    let displays = require('electron').screen.getAllDisplays();
    displays.map(function(display) {
        if (
            win.getPosition()[0] >= display.bounds.x
            &&
            win.getPosition()[1] >= display.bounds.y
            &&
            win.getPosition()[0] < (display.bounds.x + display.bounds.width)
            &&
            win.getPosition()[1] < (display.bounds.y + display.bounds.height)
        ) {
            on_a_display = true;
        }
    });
    if (!on_a_display) {
        // reset to center
        win.center();
    }

    win.loadFile(path.join(app.getAppPath(), 'app', 'views', 'interface.html'));
    win.once('ready-to-show', () => {
        win.show();
        win.setTitle(`BarryCarlyon Twitch Developer Rig Manifester: v${app.getVersion()}`);
    });
    if (!app.isPackaged) {
        console.log('Invoking dev tools');
        setTimeout(() => {
            win.webContents.openDevTools();
        }, 1000);
    }

    ipcMain.on('openWeb', (e,url) => {
        shell.openExternal(url);
    });
    ipcMain.on('minimize', () => {
        win.minimize();
    });
    ipcMain.on('quit', () => {
        app.quit();
    });

    // add updater
    require(path.join(app.getAppPath(), 'app', 'modules', 'updater.js'))({ app, ipcMain, win });
    // handler
    ipcMain.on('openDirectory', async () => {
        const result = await dialog.showOpenDialog(win, {
            properties: ['openDirectory']
        });
        console.log(result.filePaths);
        if (result.filePaths && result.filePaths.length == 1) {
            win.webContents.send('gotDirectory', result.filePaths[0]);
        }
    });



    const jwt = require('jsonwebtoken');
    const fetch = require('electron-fetch').default;
    const { ClassicLevel } = require('classic-level')

    ipcMain.on('attemptCreate', async (event, record) => {
        console.log('INPUT', record);
        // lets go
        let { extension_name, save_path } = record;
        let { extension_id, extension_secret, owner_id } = record;
        let { extension_version } = record;

        // lets get data

        // signature first
        const sigConfigPayload = {
            "exp": Math.floor(new Date().getTime() / 1000) + 4,
            "user_id": `${owner_id}`,
            "role": "external",
        }
        const token = jwt.sign(sigConfigPayload, Buffer.from(extension_secret, 'base64'));

        let url = new URL('https://api.twitch.tv/helix/extensions');
        let params = [
            [ 'extension_id', extension_id ],
        ];
        if (extension_version) {
            params.push([ 'extension_version', extension_version ]);
        }
        url.search = new URLSearchParams(params).toString();

        let response = await fetch(
            url,
            {
                method: 'GET',
                headers: {
                    'Client-ID': extension_id,
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        );
        if (response.status != 200) {
            win.webContents.send('resultCreate', `Failed to get Extension: ${await response.text()}`);
            return;
        }
        let data = await response.json();
        if (!data.hasOwnProperty('data')) {
            win.webContents.send('resultCreate', `Failed to get Extension: Missing Data`);
            return;
        }
        if (data.data.length != 1) {
            win.webContents.send('resultCreate', `Failed to get Extension: Not one Result returned ${data.data.length}`);
            return;
        }

        let theExtension = data.data[0];
        // build the manifest file
        let manifest = {
            "allowHttpBackend": false,
            "backendCommand": "",
            "backendFolderName": "",
            "certificateExceptions": [],
            "extensionViews": [],
            "frontendCommand": "",
            "frontendFolderName": "",
            "manifest": {
                "anchor": "",
                "assetURLs": [],
                "authorName":                   theExtension.author_name,
                "bitsEnabled":                  theExtension.theExtension,
                "canInstall":                   theExtension.can_install,
                "configUrl":                    theExtension.views.config.viewer_url,
                "configurationLocation":        theExtension.configuration_location,
                "description":                  theExtension.description,
                "eulaTosUrl":                   theExtension.eula_tos_url,
                "hasChatSupport":               theExtension.has_chat_support,
                "iconUrl":                      theExtension.icon_url,
                "iconUrls":                     theExtension.icon_urls,
                "id":                           theExtension.id,
                "installationCount":            -42,
                "liveConfigUrl":                "",
                "name":                         theExtension.name,
                "panelHeight":                  (theExtension.views.panel ? theExtension.views.panel.height : 0),
                "privacyPolicyUrl":             theExtension.privacy_policy_url,
                "requestIdentityLink":          theExtension.request_identity_link,
                "requiredBroadcasterAbilities": [],
                "screenshotUrls":               theExtension.screenshot_urls,
                "sku": "",
                "state":                        theExtension.state,
                "subscriptionsSupportLevel":    theExtension.subscriptions_support_level,
                "summary":                      theExtension.summary,
                "supportEmail":                 theExtension.support_email,
                "vendorCode": "",
                "version":                      theExtension.version,
                "viewerSummary":                theExtension.viewer_summary,
                "viewerUrl":                    "",
                "viewerUrls": {
                    "mobile":                   (theExtension.views.mobile ? theExtension.views.mobile.viewer_url : ''),
                    "panel":                    (theExtension.views.panel ? theExtension.views.panel.viewer_url : ''),
                    "component":                (theExtension.views.component ? theExtension.views.component.viewer_url : ''),
                    "config":                   (theExtension.views.config ? theExtension.views.config.viewer_url : ''),
                },
                "views":                        theExtension.views,
                "whitelistedConfigUrls":        theExtension.allowlisted_config_urls,
                "whitelistedPanelUrls":         theExtension.allowlisted_panel_urls
            },
            "name": extension_name,
            "version": 2
        }

        try {
            // write the manifest file to disk
            let manifestFile = path.join(
                save_path,
                `${extension_name}.json`
            );

            fs.writeFileSync(
                manifestFile,
                JSON.stringify(manifest, null, 4)
            );

            // next we need to go play with the rig
            let prefixKey = '_file://';
            let spacer = String.fromCharCode(0, 1);
            let postfixKey = 'projectReferences';
            let finalKey = `${prefixKey}${spacer}${postfixKey}`;
            let prefixLetter = String.fromCharCode(1);

            // define the database
            let databasePath = path.join(
                app.getPath('userData'),
                '..',
                'developer-rig',
                'Local Storage',
                'leveldb'
            );
            console.log(databasePath);
            const database = new ClassicLevel(databasePath);
            // open the database
            await database.open();
            // check for existing data
            let existingData = await database.get(finalKey);
            console.log(existingData);
            if (existingData) {
                // remove control char
                existingData = existingData.substring(1);
                // and JSON parse
                existingData = JSON.parse(existingData);
                //console.log(existingData);
            } else {
                existingData = []
            }
            existingData.push({
                filePath: manifestFile,
                name: extension_name,
                secret: extension_secret
            });

            // and put it back
            let newData = `${prefixLetter}${JSON.stringify(existingData)}`;
            console.log(newData);
            await database.put(finalKey, newData);

            await database.close();

            win.webContents.send('resultCreate', `The Operation Completed. Open the Rig now!`);
        } catch (e) {
            console.log('Caputring an error', e);
            console.log('Bad Error', e.message);
            win.webContents.send('resultCreate', `Something went very wrongTM: ${e.message}`);
        }
    });
});

let win;
