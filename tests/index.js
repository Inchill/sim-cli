const { DownloaderHelper } = require('node-downloader-helper')
const dl = new DownloaderHelper('https://github.com/Inchill/vue-template', __dirname)

dl.on('end', () => console.log('Download Completed'))
dl.start()
