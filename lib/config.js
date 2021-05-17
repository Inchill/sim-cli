const fse = require('fs-extra')
const path = require('path')

const jsonConfig = {
  "name": "sim-cli",
  "mirror": "https://github.com:Inchill/vue-template#main"
}

const configPath = path.resolve(__dirname, '../config.json')

async function defineConfig () {
  try {
    await fse.outputJson(configPath, jsonConfig)
  } catch (e) {
    console.error(e)
    process.exit()
  }
}

module.exports = defineConfig
