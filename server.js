'use strict'
const net = require('net')
const fs = require('fs')
const fsPromises = fs.promises
const routehandler = require('./routeHandler')

const server = net.createServer(function (connection) {
  console.log('client connected...')
  connection.on('data', function (data) {
    console.log(requestParser(data.toString()))
    responseBuilder(data, connection)
    // connection.write(responseHeader(requestParser(data.toString())))
    // connection.end()
  })
  connection.on('close', function (data) {
    console.log('client disconnected')
  })
})

server.listen(5432, function () {
  console.log('Listening for connections')
})

async function responseBuilder (requestData, connection) {
  const requestObj = requestParser(requestData.toString())
  let responseHeader = ''
  let data
  if (requestObj.path === '/' || requestObj.path.split('.').length > 1) {
    console.log('alpha', requestObj.path.split('.'))
    data = await staticHandler(requestObj)
  } else {
    console.log('beta')
    data = routehandler.main(requestObj)
  }
  if (data === 404) {
    responseHeader = Buffer.from('HTTP/1.1 404 Not Found\r\n')
    data = Buffer.from('<html><h1>404 Page not found</h1></html>')
  }
  console.log('data', data)
  if (responseHeader == '') responseHeader = Buffer.from('HTTP/1.1 200 OK\r\n')
  const contentLength = Buffer.from(`Content-Length: ${Buffer.byteLength(data)}`)
  const breakLine = Buffer.from('\r\n\r\n')
  const response = Buffer.concat([responseHeader, responseType(requestObj.path), contentLength, breakLine, data])
  connection.write(response)
  // connection.end()
}

async function staticHandler (requestObj) {
  let data
  try {
    if (requestObj.path == '/') {
      data = await fsPromises.readFile('public/index.html')
    } else {
      data = await fsPromises.readFile('public' + requestObj.path)
    }
  } catch (err) {
    // console.log(err.code)
    // if (err.code == 'ENOENT') responseHeader = Buffer.from('HTTP/1.1 404 Not Found\r\n')
    data = 404
  }
  return data
}

function responseType (path) {
  let type = path.split('.')
  const mimeType = {
    ico: 'image/x-icon',
    html: 'text/html',
    js: 'text/javascript',
    json: 'application/json',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpeg',
    wav: 'audio/wav',
    mp3: 'audio/mpeg',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    doc: 'application/msword',
    eot: 'appliaction/vnd.ms-fontobject',
    ttf: 'aplication/font-sfnt',
    gif: 'image/gif'
  }
  // console.log('content-type', type, path)
  if (type !== 'undefined' && type.length > 0) type = type[type.length - 1]
  // console.log('mimeType', `content-type: ${mimeType[type]}`)
  return Buffer.from(`content-type: ${mimeType[type]}\r\n`)
}

function requestParser (input) {
  const request = input.split('\r\n\r\n')
  const requestObj = headerParser(request[0])
  if ('Content-Length' in requestObj && requestObj['Content-Length'] > 0) {
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
