const express = require('express')
const app = express()

const http = require('http').createServer(app)

app.get('/', (req, res) => {
  res.send('test')
})

const port = process.env.PORT || 3000
http.listen(port, () => console.log(`Server has been started on port ${port}`))