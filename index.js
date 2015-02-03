var through = require('through2')
var JSONStream = require('JSONStream')
var duplexify = require('duplexify')

module.exports = function (metadata) {
  var err = null

  var inp = JSONStream.stringify()
  var out = through.obj(function (data, enc, cb) {
    this.push(data)
    cb()
  }, function (cb) {
    this.push(',"error": ' + JSON.stringify(err) + '}')
    cb()
  })

  out.push('{')

  if (metadata) {
    Object.keys(metadata).forEach(function(key) {
      out.push(JSON.stringify(key) + ':' + JSON.stringify(metadata[key]) + ',')
    })
  }

  out.push('"result":')

  var dup = duplexify.obj(inp, out, {destroy: false})

  dup.on('close', function () {
    err = 'Unexpected close of stream'
    inp.end()
  })

  dup.on('error', function (e) {
    err = e.message
    inp.end()
  })

  inp.pipe(out)
  return dup
}
