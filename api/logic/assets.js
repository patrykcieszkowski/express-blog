const bbcode = require('node-bbcode')

let assets = module.exports = {
  parseBBC: (parseBBC, callback) =>
  {
    return callback(bbcode.render(parseBBC, {}))
  },

  toSeoUrl: (title) =>
  {
    let url = title
    .toLowerCase() // change everything to lowercase
    .replace(/^\s+|\s+$/g, "") // trim leading and trailing spaces
    .replace(/[_|\s]+/g, "-") // change all spaces and underscores to a hyphen
    .replace(/[-]+/g, "-") // replace multiple instances of the hyphen with a single instance
    .replace(/^-+|-+$/g, "") // trim leading and trailing hyphens

    return url
  }
}
