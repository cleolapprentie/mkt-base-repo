const fs = require('fs')

const jsconfig = {
  compilerOptions: {
    baseUrl: `./${process.env.PROJECT}`,
    paths: {
      '@/*': ['./src/*']
    }
  },
  include: ['./src/**/*'],
  exclude: ['node_modules', 'dist', '.vscode']
}

fs.writeFile('./jsconfig.json', JSON.stringify(jsconfig, null, 2), function (err) {
  if (err) throw err
  console.log('rewrite alias setting success!')
})
