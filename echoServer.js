'use strict'
const net = require('net')

const server = net.createServer(function (connection) {
  console.log('client connected...')
  connection.on('data', function (data) {
    console.log('data recd: ' + data.toString())
    connection.write('Data sent: ' + data.toString())
  })
  connection.on('close', function (data) {
    console.log('client disconnected')
  })
})

server.listen(5432, function () {
  console.log('Listening for connections')
})
