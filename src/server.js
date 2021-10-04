const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addEvent') {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addEvent(request, response, bodyParams);
    });
  }
};

// Handles Get Functions
const handleGet = (request, response, parsedUrl) => {
  const params = query.parse(parsedUrl.query);
  if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getEvent') {
    jsonHandler.getEvent(request, response, params);
  } else {
    jsonHandler.notReal(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url); // Parse the url

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl); // Post Method
  } else {
    handleGet(request, response, parsedUrl); // Get Method
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
