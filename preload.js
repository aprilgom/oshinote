const { contextBridge} = require('electron')
const fs = require('fs')


contextBridge.exposeInMainWorld('myAPI',{
    getTextures: () => {
        //return require("./textures.json")
        let textures = fs.readFileSync("./textures.json")
        return JSON.parse(textures)
    },
    saveTextures: (target) => {
        fs.writeFileSync("./textures.json", JSON.stringify(target))
    }
})
