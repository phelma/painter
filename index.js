const PORT = process.env.PORT || 3200;

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Bundler = require('parcel-bundler');
const file = 'client/index.html';
const parcelOptions = {};
const bundler = new Bundler(file, parcelOptions);

const data = [[0, 0], [0, 0]];
let step = 1;

app.get('/api', (req, res) => {
  res.json({ data, step });
});

if (process.env.DIST){
  console.log('serving built');
  app.use(express.static('dist'));
} else {
 console.log('serving dev')
 app.use(bundler.middleware());
}

io.on('connection', socket => {
  console.log('user connected', socket.id);

  socket.on('pixel', pixel => {});

  socket.on('canvas', data => {
    io.binary(true).emit('canvas', data);
  });
});

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
