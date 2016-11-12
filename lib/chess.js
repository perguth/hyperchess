const convert = require('./convert')

module.exports = {
  isMovePossible: (src, dest, core) => convert.moveToNotation(src, dest, core)
}
