const { contextBridge} = require('electron')
const fs = require('fs')
const textures = require("./textures.json")


contextBridge.exposeInMainWorld('myAPI',{
    getTextures: () => {
        return textures
    },
    saveTextures: (target) => {
        fs.writeFileSync("./textures.json", JSON.stringify(target))
    }
})
