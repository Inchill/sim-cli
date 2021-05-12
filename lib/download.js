const download = require('download')
const ora = require('ora')
const chalk = require('chalk')
const fse = require('fs-extra')
const path = require('path')

const defConfig = require('./config')
const cfgPath = path.resolve(__dirname, '../config.json')
const tplPath = path.resolve(__dirname, '../template')

async function downloadTemplate () {
  const exists = await fse.pathExists(cfgPath)

  if (!exists) {
    await defConfig()
  }

  await downloadAction()
}

async function downloadAction () {
  try {
    await fse.remove(tplPath)
  } catch (e) {
    console.error(e)
    process.exit()
  }

  // get the mirror link
  const jsonConfig = await fse.readJson(cfgPath)

  // init Spinner
  const dlSpinner = ora(chalk.cyan('Downloading template...'))

  dlSpinner.start()

  try {
    await download(jsonConfig.mirror + 'template.zip', path.resolve(__dirname, '../template/'), {
      extract: true
    })
  } catch (e) {
    dlSpinner.text = chalk.red(`Download template failed. ${e}`)
    dlSpinner.fail()
    process.exit()
  }

  dlSpinner.text = 'Download template successfully.'
  dlSpinner.succeed()
}

module.exports = downloadTemplate
