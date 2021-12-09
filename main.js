'use strict'

const electron = require('electron')

const {app, BrowserWindow, ipcMain} = electron
const path = require('path')
const fs = require('fs')

ipcMain.on('saveTextures', (arg) => {
    console.log(arg)
})

function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname,'preload.js')
        },
        frame: false,
    })

    win.loadFile(path.join(__dirname,'index.html'))
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow()
        } 
    })
})

app.on('window-all-closed',()=> {
    if(platform !== 'darwin'){
        app.quit()
    }
})