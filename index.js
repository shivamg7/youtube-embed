const { v4: uuidv4 } = require('uuid');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

app = express();

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('index'))

var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {

  socket.nickname = uuidv4();
  console.log(`${socket.nickname} connected!`);

  socket.on('pause', (msg) => {
    console.log(`${socket.nickname} paused video at ${msg}`);
    socket.broadcast.emit('pause', msg);
  });

  socket.on('play', (msg) => {
    console.log(`${socket.nickname} played video at ${msg}`);
    socket.broadcast.emit('play', msg);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.nickname} disconnected!`);
  });
});


http.listen(PORT, () => {
  console.log(`listening on *:${ PORT }`);
});
