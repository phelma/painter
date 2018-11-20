import './main.scss';
import io from 'socket.io-client';

console.log('LETS GO');

const HEIGHT = 50;
const WIDTH = 100;
const SCALE = 10;

const socket = io();

// const images = document.getElementById('images');
const canvas = document.getElementById('canvas');
canvas.height = HEIGHT;
canvas.width = WIDTH;

canvas.style.height = HEIGHT * SCALE + 'px';
canvas.style.width = WIDTH * SCALE + 'px';

const ctx = canvas.getContext('2d');

ctx.fillStyle = 'green';

let mouseIsDown = false;

const run = () => {
  if (mouseIsDown) {
    requestAnimationFrame(run);
  }
};

const addPixel = (x, y) => {
  ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
  socket.emit('pixel', { x, y });
};

const sendCanvas = () => {
  const imageData = ctx.getImageData(0, 0, 500, 500);
  // const imageData = canvas.toDataURL();
  socket.binary(true).emit('canvas', imageData.data.buffer);
};

const drawCanvas = data => {
  ctx.putImageData(new ImageData(new Uint8ClampedArray(data), 500, 500), 0, 0);
};

canvas.addEventListener('mousedown', e => {
  mouseIsDown = true;
  addPixel(
    (e.clientX - e.target.offsetLeft) / SCALE,
    (e.clientY - e.target.offsetTop) / SCALE
  );
  run();
});

window.addEventListener('mouseup', e => {
  mouseIsDown = false;
  addPixel(
    (e.clientX - e.target.offsetLeft) / SCALE,
    (e.clientY - e.target.offsetTop) / SCALE
  );
  sendCanvas();
});

canvas.addEventListener('mousemove', e => {
  if (!mouseIsDown) return;
  addPixel(
    (e.clientX - e.target.offsetLeft) / SCALE,
    (e.clientY - e.target.offsetTop) / SCALE
  );
  // sendCanvas();
});

socket.on('connect', () => {
  console.log('connected', socket.id);
});

socket.on('canvas', data => {
  drawCanvas(data);
});
socket.on('disconnect', () => {
  console.log('disconnected');
});
