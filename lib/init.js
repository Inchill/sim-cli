const fse = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')
const inquirer = require('inquirer')
const handlebars = require('handlebars')
const path = require('path')
const dlTemplate = require('./download')
const prompts = require('../config/prompts')

async function initProject (projectName) {
  try {
    const exists = await fse.pathExists(projectName)
    if (exists) {
      console.log(symbols.error, chalk.red('The project already exists.'))
    } else {
      inquirer.prompt(prompts).then(async anwsers => handleAnwsers(anwsers, projectName))
    }
  } catch (e) {
    if (e.isTtyError) {
      console.log(symbols.error, chalk.red("Prompt couldn't be rendered in the current environment."))
    } else {
      console.log(symbols.error, chalk.red(e))
    }
  }
}

async function handleAnwsers (answers, projectName) {
  const initSpinner = ora(chalk.cyan('Initializing project...'))
  initSpinner.start()

  const templatePath = path.resolve(__dirname, '../template/')
  const processPath = process.cwd()
  const LCProjectName = projectName.toLowerCase()
  const targetPath = `${processPath}/${LCProjectName}`

  const exists = await fse.pathExists(templatePath)
  if (!exists) {
    await dlTemplate()
  }

  try {
    await fse.copy(templatePath, targetPath)
  } catch (err) {
    console.log(symbols.error, chalk.red(`Copy template failed. ${err}`))
    process.exit()
  }

  const multiMeta = {
    project_name: LCProjectName,
    global_name: answers.name
  }
  const multiFiles = [
    `${targetPath}/package.json`,
    `${targetPath}/gulpfile.js`,
    `${targetPath}/test/index.html`,
    `${targetPath}/src/index.js`
  ]

  for (var i = 0; i < multiFiles.length; i++) {
    // 这里记得 try {} catch {} 哦，以便出错时可以终止掉 Spinner
    try {
      // 等待读取文件
      const multiFilesContent = await fse.readFile(multiFiles[i], 'utf8')
      // 等待替换文件，handlebars.compile(原文件内容)(模板字符)
      const multiFilesResult = await handlebars.compile(multiFilesContent)(multiMeta)
      // 等待输出文件
      await fse.outputFile(multiFiles[i], multiFilesResult)
    } catch (err) {
      // 如果出错，Spinner 就改变文字信息
      initSpinner.text = chalk.red(`Initialize project failed. ${err}`)
      // 终止等待动画并显示 X 标志
      initSpinner.fail()
      // 退出进程
      process.exit()
    }
  }

  // 如果成功，Spinner 就改变文字信息
  initSpinner.text = 'Initialize project successful.'
  // 终止等待动画并显示 ✔ 标志
  initSpinner.succeed()
  console.log(`
    To get started:

      cd ${chalk.yellow(LCProjectName)}
      ${chalk.yellow('npm install')} or ${chalk.yellow('yarn install')}
      ${chalk.yellow('npm run dev')} or ${chalk.yellow('yarn run dev')}
  `)
}

module.exports = initProject
