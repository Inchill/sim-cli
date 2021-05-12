#!/usr/bin/env node

const { program } = require('commander')
const updateCheck = require('../lib/update')
const setMirror = require('../lib/mirror')
const dlTemplate = require('../lib/download')
const initProject = require('../lib/init')

program.version(require('../package.json').version, '-v, --version')

program
  .command('upgrade')
  .description('check the sim-cli version')
  .action(() => {
    updateCheck()
  })

program
  .command('mirror <template_mirror>')
  .description("Set the template mirror.")
  .action(tplMirror => {
    setMirror(tplMirror)
  })

program
  .command('template')
  .description("Download template from mirror.")
  .action(() => {
    dlTemplate()
  })

program
  .name('sim-cli')
  .usage('<commands> [options]')
  .command('init <project_name>')
  .description('Create a vue project.')
  .action(project => {
    initProject(project)
  })

program.parse(process.argv)
