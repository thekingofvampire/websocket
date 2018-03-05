const express = require('express');
const path = require('path')
const app = require('express')();
const server = require('http').Server(app);
// const io = require('socket.io')(server);
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const ws = require('ws').Server;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'index')))
app.post('/user', (req, res) => {
   res.send({
      code: 1,
      msg: req.body
   })
})
var cons = new Array();
var _server = new ws({ host: "localhost", port: 3001 });
_server.on('connection', function (ws) {
   console.log('new connection founded successfully');
   cons.push(ws);

   ws.on('message', function (data) {
      // console.log("data")
      // console.log(data)
      for (var i = 0; i < cons.length; i++) {
         cons[i].send(data);
      }
   });
   ws.on('close', function () {
      for (var i = 0; i < cons.length; i++) {
         if (cons[i] == ws) cons.splice(i, 1);
      }
   });
});
server.listen(8080);