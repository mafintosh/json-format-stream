# json-format-stream

Streaming JSON serializer that allows you to add metadata and will forward an error message if the stream is destroyed prematurely

```
npm install json-format-stream
```

[![build status](http://img.shields.io/travis/mafintosh/json-format-stream.svg?style=flat)](http://travis-ci.org/mafintosh/json-format-stream)

## Usage

``` js
var format = require('json-format-stream')

var stream = format({some: 'metadata'})

stream.write({some: 'data'})
stream.write({more: 'data'})
stream.destroy(new Error('an error occurred'))

stream.pipe(process.stdout)
```

Running the above will print out

```
{
  "some": "metadata",
  "result": [
    {
      "some": "data"
    },
    {
      "more": "data"
    }
  ],
  "error": "an error occurred"
}
```

If you don't call `destroy` the error property in the result will be set to `null` when the stream finishes.
The main result is streamed using [JSONStream](https://github.com/dominictarr/JSONStream.git) which makes this memory efficient

## API

#### `stream = format(metadata, options)`

Creates a new JSON formatter. Any metadata properties you provide in the constructor will be set in the beginning of the JSON response.

Pass `options.outputKey` to specify which key data is added to. Defaults to `result`.

``` js
var stream = format(null, {outputKey: 'data'})
```

## License

MIT
