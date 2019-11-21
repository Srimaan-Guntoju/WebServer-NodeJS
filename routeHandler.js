
exports.main = function (requestObj) {
  if (requestObj.path in routeObject) {
    const data = routeObject[requestObj.path]()
    return Buffer.from(data, 'utf-8')
  }
  return 404
}

const routeObject = {
  '/about': function () {
    return 'This is a page about the Echo server'
  }
}
