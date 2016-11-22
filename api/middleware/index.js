'use strict'
const fs = require('fs')
const async = require('async')

let path = __dirname + '/'
async.forEachOf(fs.readdirSync(path), (file, key, cb) =>
{
  if (file.match(/\.js$/) !== null && file !== 'index.js')
  {
    let name = file.replace('.js', '')
    exports[name] = require(path + file)
  }
  return cb()
})
