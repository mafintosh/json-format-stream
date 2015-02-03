var format = require('./')

var stream = format({some: 'metadata'})

stream.write({some: 'data'})
stream.write({more: 'data'})
stream.destroy(new Error('an error occurred'))

stream.pipe(process.stdout)
