var tape = require('tape')
var concat = require('concat-stream')
var format = require('./')

tape('success response', function (t) {
  var stream = format()

  stream.write({hello: 'world'})
  stream.write({hello: 'new world'})
  stream.end()

  stream.pipe(concat(function (data) {
    t.same(JSON.parse(data), {result: [{hello: 'world'}, {hello: 'new world'}], error: null})
    t.end()
  }))
})

tape('error response', function (t) {
  var stream = format()

  stream.write({hello: 'world'})
  stream.write({hello: 'new world'})
  stream.destroy(new Error(':('))

  stream.pipe(concat(function (data) {
    t.same(JSON.parse(data), {result: [{hello: 'world'}, {hello: 'new world'}], error: ':('})
    t.end()
  }))
})

tape('close error response', function (t) {
  var stream = format()

  stream.write({hello: 'world'})
  stream.write({hello: 'new world'})
  stream.destroy()

  stream.pipe(concat(function (data) {
    t.same(JSON.parse(data), {result: [{hello: 'world'}, {hello: 'new world'}], error: 'Unexpected close of stream'})
    t.end()
  }))
})

tape('metadata', function (t) {
  var stream = format({metadata: 42, test: 10})

  stream.write({hello: 'world'})
  stream.end()

  stream.pipe(concat(function (data) {
    t.same(JSON.parse(data), {metadata: 42, test: 10, result: [{hello: 'world'}], error: null})
    t.end()
  }))
})

tape('opts.outputKey', function (t) {
  var stream = format(null, {outputKey: 'data'})

  stream.write({hello: 'world'})
  stream.end()

  stream.pipe(concat(function (data) {
    t.same(JSON.parse(data), {data: [{hello: 'world'}], error: null})
    t.end()
  }))
})
