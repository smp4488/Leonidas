// https://github.com/watson/bonjour
// https://www.npmjs.com/package/socket.io-client
// https://www.npmjs.com/package/node-cleanup
// https://www.npmjs.com/package/uuid

var bonjour = require('bonjour')();
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var networkData = io.of('/network-data');
var cpuData = io.of('/cpu-data');
var uuidv1 = require('uuid/v1');
var nodeCleanup = require('node-cleanup');
var si = require('systeminformation');


// JSON API
app.get('/', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    si.osInfo(function(data) {
        res.send(JSON.stringify(data));
    });
});

app.get('/static-data', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    si.getStaticData(function(data) {
        res.send(JSON.stringify(data));
    });
});

app.get('/dynamic-data', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    si.getDynamicData(function(data) {
        res.send(JSON.stringify(data));
    });
});

app.get('/network-data', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    si.networkStats(function(data) {
        res.send(JSON.stringify(data));
    });
});

networkData.on('connection', function(socket){
    console.log('network client connected');
    
    var newtworkInterval = setInterval(() => {
        console.log('network data');
        si.networkStats(function(data) {
            networkData.emit('networkData', data);
        });
    }, 1000);

    socket.on('disconnect', () => {
        clearInterval(newtworkInterval);
    });
});

cpuData.on('connection', function(socket){
    console.log('cpu client connected');
    
    var cpuInterval = setInterval(() => {
        console.log('cpu data');
        si.currentLoad(function(data) {
            cpuData.emit('cpuData', data);
        });
    }, 1000);

    socket.on('disconnect', () => {
        clearInterval(cpuInterval);
    });
});

// Socket Connection
io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

// advertise an HTTP server on port 3000
var service = bonjour.publish({ name: uuidv1(), type: 'leonidas_client', port: 3000 });

nodeCleanup(function (exitCode, signal) {
    // release resources here before node exits
    console.log('Exiting...');
    if (signal) {
        service.stop(function(){
            // calling process.exit() won't inform parent process of signal
            process.kill(process.pid, signal);
        });
        nodeCleanup.uninstall(); // don't call cleanup handler again
        return false;
    }
});