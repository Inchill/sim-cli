const symbols = require('log-symbols')
const fse = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

const defConfig = require('./config')
const cfgPath = path.resolve(__dirname, '../config.json')

async function setMirror (link) {
  const exists = await fse.pathExists(cfgPath)
  if (!exists) {
    await defConfig()
  }
  mirrorAction(link)
}

async function mirrorAction (link) {
  try {
    // read config.json
    const jsonConfig = await fse.readJSON(cfgPath)
    // set the mirror link
    jsonConfig.mirror = link
    // write the link parameter in config.json
    await fse.writeJSON(cfgPath, jsonConfig)

    console.log(symbols.success, 'Set the mirror successfully.')
  } catch (e) {
    console.log(symbols.error, chalk.red(`Set the mirror failed. ${e}`))
    process.exit()
  }
}

module.exports = setMirror
