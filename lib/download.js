const download = require('download-git-repo')
// const { DownloaderHelper } = require('node-downloader-helper')
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
    // const url = jsonConfig.mirror
    // console.log('url type', typeof url, url)
    // const dest = path.resolve(process.cwd(), projectName)
    // const dl = new DownloaderHelper(
    //   'https://github.com/Inchill/vue-template',
    //   dest
    // )

    // dl
    //   .on('end', () => {
    //     dlSpinner.text = 'Download template successfully.'
    //     dlSpinner.succeed()
    //     resolve()
    //   })
    //   .on('error', e => {
    //     reject(e)
    //   })
    // dl.start()

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
