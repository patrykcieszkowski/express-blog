'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const fs = require('fs')
const async = require('async')

let path = __dirname + '/'
async.forEachOf(fs.readdirSync(path), (file, key, cb) =>
{
  if (file.match(/\.js$/) !== null && file !== 'index.js')
  {
    let name = file.replace('.js', '')
    let modelSchema = new Schema(require(path + file)(Schema), {collection: name})
    exports[name] = mongoose.model(name, modelSchema)
  }
  return cb()
})
