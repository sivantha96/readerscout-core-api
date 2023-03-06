const serverless = require('serverless-http')
const app = require('./src/app')

const port = process.env.PORT || 3000
const env = process.env.ENVIRONMENT

if (env === 'PROD') {
  exports.handler = serverless(app)
} else {
  app.listen(port, () => {
    console.log(`ReaderScout Info Server is listening on port ${port}`)
  })
}
