const http = require('http');
const fs = require('fs');
const path = require('path');
const mine = require('mime');
const cache = {};

function send404(response) {
  response.writeHead(404, {'Content-Type': 'text-/plan'});
  response.write('Error 404: resource not found');
  response.end();
}

function sendFile(response, filepath, fileContents) {
  response.writeHead(
    200,
    {"content-type": mine.lookup(path.basename(filepath))}
  );
  response.end(fileContents)
}

function serverStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function (exists) {
      if (exists) {
        fs.readFile(absPath, function (err, data) {
          if (err) {
            send404(response)
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data)
          }
        })
      } else {
        send404(response);
      }
    })
  }
}

const server = http.createServer(function (request, response) {
  let filePath = false;

  if (request.url === '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url
  }

  const absPath = './' + filePath;
  serverStatic(response, cache, absPath);
})

server.listen(3000, function() {
  console.log('Server listening on port 3000.')
})
