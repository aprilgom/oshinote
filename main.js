'use strict'

const electron = require('electron')

const {app, BrowserWindow} = electron
const path = require('path')

function createWindow(){
    const win = new BrowserWindow({
        frame: false,
    })

    win.loadURL("http://127.0.0.1:3000")
    //win.webContents.openDevTools()
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