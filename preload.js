const { contextBridge, ipcRenderer} = require('electron')
const fs = require('fs')


contextBridge.exposeInMainWorld('myAPI',{
    getTextures: () => {
        return require("./textures.json")
    },
    saveTextures: (target) => {
        fs.writeFileSync("./textures.json", JSON.stringify(target))
    }
})
