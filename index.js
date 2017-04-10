#!/usr/bin/env node
'use strict'

const program = require('commander')
const packagePath = require('parent-package-json')
const fs = require('fs')
const mkdirp = require('mkdirp')

const classTemplate = require('./lib/react/class')
const statelessTemplate = require('./lib/react/stateless')

//
// Helper Functions
// ==================================================
// ==================================================
//

const reactComponentDescription = `Scaffold React components in: \n\t- index.scss \n\t- /components`
const handleReactComponent = (componentName, options) => {
  const { path } = packagePath()
  const root = (path)
    ? path.substring(0, path.lastIndexOf('/'))
    : '.' // default to current dir

  const components = '/src/components/'
  const dirpath = root + components + componentName

  mkdirp(dirpath, (err) => {
    if (err) throw err

    // Scaffold React component
    fs.open(`${dirpath}/${componentName}.js`, 'ax', (err, fd) => {
      if (err) throw err

      if (options.class) {
        fs.write(fd, classTemplate, (err) => {if (err) throw err})
      }
      else {
        fs.write(fd, statelessTemplate, (err) => {if (err) throw err})
      }
    })

    // Create component SASS file
    fs.open(`${dirpath}/${componentName}.scss`, 'ax', (err, fd) => {
      if (err) throw err
      fs.write(fd, `@import '../../variables.scss';`)
    })

    // Import component SASS in index
    fs.open(`${root}/src/index.scss`, 'a', (err, fd) => {
      if (err) throw err
      fs.write(fd, '\n' + `@import './components/${componentName}/${componentName}.scss';`)
    })
  })
}

//
// CLI Defintion
// ==================================================
// ==================================================
//

program.version('0.0.1')
.command('react <componentName>')
.option('-s, --stateless', 'Create a stateless functional React component')
.option('-c, --class', 'Create a class based React component')
.description(reactComponentDescription)
.action(handleReactComponent)

program.parse(process.argv)
