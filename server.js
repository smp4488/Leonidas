// https://github.com/watson/bonjour
// https://www.npmjs.com/package/socket.io-client

var bonjour = require('bonjour')();
var app = require('express')();
var http = require('http').Server(app);
var request = require('request');
var io = require('socket.io')(http);
var ioClient = require('socket.io-client');

var clients = [];

// Bonjour, browse for all leonidas clients
var browser = bonjour.find({ type: 'leonidas_client' }, function (service) {
    console.log('Found a Leonidas Client:',service.name);
    // Make request for system info
    request("http://" + service.referer.address + ':' + service.port, function (error, response, body) {
        service.osInfo = JSON.parse(body);
        clients.push(service);
        io.emit('client_connected', service);
    });
});

browser.on('down', function(service){
    console.log('a client disconnected', service.name);
    for (var i in clients) {
        if (clients[i].name == service.name) {
            clients.splice(i, 1);
            io.emit('client_disconnected', service.name);
        }
    }
});

// JSON API
app.get('/clients', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(JSON.stringify(clients));
});

app.get('/clients/:id', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    clients.forEach(function(client) {
        if(client.name == req.params.id) {
            res.send(JSON.stringify(client));
        }
    });
});

// Socket Connection
io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(3001, function(){
    console.log('listening on *:3001');
});