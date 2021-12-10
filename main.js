'use strict'

const electron = require('electron')

const {app, BrowserWindow } = electron
const path = require('path')
const fs = require('fs')

function createWindow(){
    const win = new BrowserWindow({
        width: 390,
        height: 570,
        webPreferences: {
            preload: path.join(__dirname,'preload.js'),
            //zoomFactor: 1
        },
        resizable: false,
        frame: false
    })

    win.loadFile(path.join(__dirname,'index.html'))
    win.setContentSize(390,570)
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow()
        } 
    })
    const{ screen } = require('electron')

    const primaryDisplay = screen.getPrimaryDisplay()

})

app.on('window-all-closed',()=> {
    if(platform !== 'darwin'){
        app.quit()
    }
})