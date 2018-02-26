// Do not touch the auto loader function
import glob from 'glob';
import { basename } from 'path';
import SocketIo from 'koa-socket';
import isDev from 'isdev';

export default function (app) {
  const io = new SocketIo();
  io.attach(app);
  io.on('connection', (ctx) => {
    if (isDev) {
      console.log('Join event', ctx.socket.id); // eslint-disable-line
    }
    io.broadcast('connections', {
      numConnections: io.connections.size
    });
  });
  io.on('disconnect', (ctx) => {
    if (isDev) {
      console.log('Leave event', ctx.io.id); // eslint-disable-line
    }
    io.broadcast('connections', {
      numConnections: io.connections.size
    });
  });

  glob(`${__dirname}/*.js`, { ignore: '**/index.js' }, (err, matches) => {
    if (err) {
      throw err;
    }

    if (matches) {
      matches.forEach((mod) => {
        const ioMod = require(`./${basename(mod, '.js')}`); // eslint-disable-line
        ioMod.default(io);
      });
    }
  });
}
