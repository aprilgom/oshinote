'use strict'

const electron = require('electron')

const {app, BrowserWindow, Menu } = electron
const path = require('path')

Menu.setApplicationMenu(null)

function createWindow(){
    const win = new BrowserWindow({
        width: 390,
        height: 570,
        webPreferences: {
            preload: path.join(__dirname,'preload.js'),
            //zoomFactor: 1
        },
        //resizable: false,
        frame: false,
        show: false
    })

    win.loadFile(path.join(__dirname,'index.html'))
    win.setContentSize(390,570)
    win.webContents.once('did-finish-load',()=>{
        win.show()
    })
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
    if(process.platform !== 'darwin'){
        app.quit()
    }
})