'use strict'
const net = require('net')
const fs = require('fs')
const fsPromises = fs.promises

const server = net.createServer(function (connection) {
  console.log('client connected...')
  connection.on('data', function (data) {
    // console.log('data recd: \n' + data.toString())
    responseHeader(requestParser(data.toString()), connection)
    // connection.write(responseHeader(requestParser(data.toString())))
    // connection.end()
    // connection.write('Data sent: ' + data.toString())
  })
  connection.on('close', function (data) {
    console.log('client disconnected')
  })
})

server.listen(5432, function () {
  console.log('Listening for connections')
})

function requestParser (input) {
  const request = input.split('\r\n\r\n')
  const requestObj = headerParser(request[0])
  // console.log(requestObj)
  if (requestObj.method == 'POST') {
    requestObj['body'] = request[1]
  }

  return requestObj
}

function headerParser (input) {
  const headerArray = input.split('\r\n')
  const requestObj = requestlineParser(headerArray[0])
  for (let i = 1; i < headerArray.length; i++) {
    const temp = headerArray[i].split(': ')
    requestObj[temp[0]] = temp[1]
  }
  return requestObj
}

function requestlineParser (input) {
  const requestLine = input.split(' ')
  const requestlineObj = { method: requestLine[0] }
  requestlineObj['path'] = requestLine[1]
  requestlineObj['version'] = requestLine[2]
  return requestlineObj
}
