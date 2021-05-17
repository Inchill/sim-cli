const fse = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')
const inquirer = require('inquirer')
// const handlebars = require('handlebars')
const path = require('path')
const prompts = require('../config/prompts')
const downloadTemplate = require('./download')

async function initProject (projectName) {
  try {
    const exists = await fse.pathExists(projectName)
    if (exists) {
      console.log(symbols.error, chalk.red('The project already exists.'))
    } else {
      inquirer.prompt(prompts).then(anwsers => initTemplate(anwsers, projectName))
    }
  } catch (e) {
    if (e.isTtyError) {
      console.log(symbols.error, chalk.red("Prompt couldn't be rendered in the current environment."))
    } else {
      console.log(symbols.error, chalk.red(e))
    }
  }
}

async function initTemplate (answers) {
  const { projectName } = answers

  try {
    const initSpinner = ora(chalk.cyan('Initializing project...'))
    initSpinner.start()

    await checkName(projectName)
    await downloadTemplate(projectName)
    await changeTemplate(answers)

    // 如果成功，Spinner 就改变文字信息
    initSpinner.text = 'Initialize project successfully.'
    // 终止等待动画并显示 ✔ 标志
    initSpinner.succeed()
    console.log(`
      To get started:

        cd ${chalk.yellow(projectName)}
        ${chalk.yellow('npm install')} or ${chalk.yellow('yarn install')}
        ${chalk.yellow('npm run dev')} or ${chalk.yellow('yarn run dev')}
    `)
  } catch (e) {
    console.log(chalk.red(e))
    process.exit()
  }
}

function checkName (projectName) {
  return new Promise((resolve, reject) => {
    fse.readdir(process.cwd()).then(data => {
      if (data.includes(projectName)) {
        return reject(new Error(`${projectName} already exists!`))
      }
      fse.mkdir(projectName, e => {
        if (e) {
          reject(e)
        }
        resolve()
      })
    }).catch(e => {
      reject(e)
    })
  })
}

function changeTemplate (answers) {
  const { projectName = '', description = '', author = '' } = answers

  return new Promise((resolve, reject) => {
    fse.readFile(
      path.resolve(process.cwd(), projectName, 'package.json'),
      'utf8',
      (err, data) => {
        if (err) return reject(err)

        const pkgContent = JSON.parse(data)
        pkgContent.name = projectName
        pkgContent.author = author
        pkgContent.description = description

        fse.writeFile(
          path.resolve(process.cwd(), projectName, 'package.json'),
          JSON.stringify(pkgContent, null, 2),
          'utf8',
          (err, data) => {
            if (err) {
              return reject(err)
            }
            resolve(data)
          }
        )
      }
    )
  })
}

module.exports = initProject
