const http = require('http');
const server = http.createServer(function (req, res) {
    if (req.url == '/') { 
        // set response header
        res.writeHead(200, { 'Content-Type': 'text/html' });
        // set response content
        res.write('<h3>LouVinhLuan</h3><p>This is home Page.</p>');
        res.end();
    }
    else if (req.url == '/student') {
        // set response header
        res.writeHead(200, { 'Content-Type': 'text/html' });
        // set response content
        res.write('<html><body><h3>LouVinhLuan</h3><p>This is the student Page</p></body></html>');
        res.end();
    }
    else if (req.url == '/admin') {
    // set response header
    res.writeHead(200, { 'Content-Type': 'text/html' });
    // set response content
    res.write('<html><body><h3>LouVinhLuan</h3><p>This is the admin Page</p></body></html>');
    res.end();
    }
    else if (req.url == '/data') {
    // set response header
    res.writeHead(200, { 'Content-Type': 'application/json' });
    // set response content
    res.write(JSON.stringify({ message: 'Hello World JSON and LouVinhLuan.' }));
    res.end();
    }
    else {
        res.end('Invalid Request!');
    }
})
server.listen(8000);
console.log('Node.js web server at port 8000 is running..');