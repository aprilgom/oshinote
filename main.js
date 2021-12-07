'use strict'

const electron = require('electron')

const {app, BrowserWindow} = electron
const path = require('path')

function createWindow(){
    const win = new BrowserWindow({
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