const { connect, connection } = require('mongoose')

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

exports.Database = class Database {
  isConnected = false

  async connect () {
    if (this.isConnected) return

    const uri = process.env.MONGO_URL

    await connect(uri, mongoOptions)
      .then(() => {
        this.isConnected = true
        console.log('Connected to the database')
      })
      .catch((e) => {
        this.isConnected = false
        console.log('Failed to connect to the database')
        console.log(e)
      })

    // bind connection to error event to get notification of connection errors
    connection.on('error', () => {
      console.log('Connected to the database is lost')
      this.isConnected = false
    })
  }
}
