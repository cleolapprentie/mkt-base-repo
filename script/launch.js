const spawn = require('cross-spawn')

const env = process.argv[2]
const project = process.argv[3]

if (!project) {
  console.log('target not exists!')
  return
}

process.env.PROJECT = project
process.env.PROJECT_BASE_URL = `projects/${project}`

if (env === 'dev') {
  spawn(
    'vue-cli-service',
    ['serve', '--port', '3000'],
    { stdio: 'inherit' }
  )
} else if (env === 'build') {
  process.env.BUILD = 'true'
  spawn(
    'vue-cli-service',
    ['build'],
    { stdio: 'inherit' }
  )
}
