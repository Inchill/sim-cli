const updateNotifier = require('update-notifier')
const chalk = require('chalk')
const pkg = require('../package.json')

const notifier = updateNotifier({
  pkg,
  // default value is 1 * 24 * 60 * 60 * 1000
  updateCheckInterval: 1 * 24 * 60 * 60 * 1000
})

function updateCheck () {
  if (notifier.update) {
    console.log(`New version available: ${chalk.cyan(notifier.update.latest)}, it's recommended that you update before using.`)
    notifier.notify()
  } else {
    console.log('No new version is available.')
  }
}

module.exports = updateCheck
