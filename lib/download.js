const download = require('download-git-repo')
const ora = require('ora')
const chalk = require('chalk')
const fse = require('fs-extra')
const path = require('path')

const defConfig = require('./config')
const cfgPath = path.resolve(__dirname, '../config.json')
const tplPath = path.resolve(__dirname, '../template')

async function downloadTemplate(projectName) {
  const exists = await fse.pathExists(cfgPath)

  if (!exists) {
    await defConfig()
  }

  await downloadAction(projectName)
}

async function downloadAction(projectName) {
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

  return new Promise((resolve, reject) => {
    download(
      jsonConfig.mirror,
      path.resolve(process.cwd(), projectName),
      {
        clone: true
      },
      function (e) {
        if (e) {
          dlSpinner.text = chalk.red(`Download template failed. ${e}`)
          dlSpinner.fail()
          process.exit()
          return reject(e)
        }

        dlSpinner.text = 'Download template successfully.'
        dlSpinner.succeed()
        resolve()
      }
    )
  })
}

module.exports = downloadTemplate
