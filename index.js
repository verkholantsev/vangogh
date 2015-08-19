'use strict';

var PORT = 8080;
var ENCODING = 'utf8';

var express = require('express');
var http = require('http');
var socketIo = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIo(server);

var ansiUp = require('ansi_up');
var ansiToHtml = ansiUp.ansi_to_html;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var stdin = process.stdin;

stdin.setEncoding(ENCODING);

io.on('connection', function (socket) {
    stdin.on('readable', function () {
        var chunk = stdin.read();

        if (chunk === null) {
            return;
        }

        chunk = chunk.replace(/\n$/, '');

        var html = ansiToHtml(chunk);

        socket.emit('new-chunk', {
            content: html
        });
    });
});

server.listen(PORT);

