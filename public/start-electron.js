const electron = require('electron'),
    app = electron.app,
    BrowserWindow = electron.BrowserWindow,
    ipcMain = electron.ipcMain;


const path = require('path'),
    isDev = require('electron-is-dev');

const CanSmeller = require('./cansmeller/CanSmeller')
const cansmeller = new CanSmeller('can0')
const { exec } = require("child_process");

let startTime
let endTime
let interval
let statsInterval
let mainWindow;
let snifferResults = {}
let recorder;
const createWindow = () => {
    mainWindow = new BrowserWindow({ width: 1100, height: 640, frame: false, webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        } })
    const appUrl = isDev ? 'http://localhost:3000' :
        `file://${path.join(__dirname, '../build/index.html')}`
    mainWindow.loadURL(appUrl)
    mainWindow.on('closed', () => mainWindow = null)
    if(isDev) {
        mainWindow.webContents.openDevTools({mode: "detach"})
    }
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
    // Follow OS convention on whether to quit app when
    // all windows are closed.
    if (process.platform !== 'darwin') { app.quit() }
})
app.on('activate', () => {
    // If the app is still open, but no windows are open,
    // create one when the app comes into focus.
    if (mainWindow === null) { createWindow() }
})

ipcMain.on('process', (event, data) => {
    switch(data.type) {
        case 'recorderMS':
            if(data.action === "start") {
                recorder = exec("candump -l can0");
            } else {
                recorder.kill('SIGINT')
            }
            break;
        case 'button':
            cansmeller.buttonFind()
            statsInterval = setInterval(() => {
            mainWindow.webContents.send('stats', cansmeller.stats)
            cansmeller.syncCounts()
            }, 1000)

            break;
        case 'buttonSmelling':
            startTime = new Date()
            mainWindow.webContents.send('countdown', true)
            setTimeout(() => {
                cansmeller.finishButton()
                clearInterval(interval)
                clearInterval(statsInterval)
                mainWindow.webContents.send('countdown', false)
            }, data.time)
            interval = setInterval(() => {
                let secondsRemaining = Math.floor((new Date().getTime() - startTime.getTime())/1000)
                mainWindow.webContents.send('remaining', secondsRemaining)
                if(secondsRemaining === 3) {
                    cansmeller.beginChecking()
                    console.log("press")
                }
            }, 100)
            break;
        case 'sniffer':
            if(data.action === "start") {
                cansmeller.beginSniffer(data.filters)
                mainWindow.webContents.send('sniffingStatus', true)
                data.filters.forEach(e => snifferResults[e] = [])
            } else {
                cansmeller.endSniffer()
                mainWindow.webContents.send('sniffingStatus', false)
            }

    }

})

cansmeller.on('learning', (data) => {
    mainWindow.webContents.send('learning', data)
    if(data) {
        mainWindow.webContents.send('complete', [])
    }

})

cansmeller.on('complete', (results) => {
    mainWindow.webContents.send('complete', results)
})

cansmeller.on('snifferUpdate', (data) => {
    console.log(data)
    snifferResults[data.id] = Array.from(data.data)
    mainWindow.webContents.send('snifferUpdate', snifferResults)
})



