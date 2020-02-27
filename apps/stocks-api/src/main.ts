/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { environment } from './environments/environment';
import { Server } from 'hapi';

const h2o2 = require('@hapi/h2o2');

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost'
  });

  await server.register(h2o2);

  const fetchData = async (symbol, period) => {
    let res = '';
    await server.inject(`/proxy/stock/${symbol}/chart/${period}`).then(result => {
      res = result.payload;
    });
    return res;
  };

  server.method({
    name: 'getData',
    method: fetchData,
    options: {
      cache: {
        expiresIn: 30 * 1000,
        generateTimeout: 3000
      }
    }
  });

  server.route({
    path: '/beta/stock/{symbol}/chart/{period}',
    method: 'GET',
    handler: async (request, h) => {
      return server.methods.getData(request.params.symbol, request.params.period);
    }
  });

  server.route({
    path: '/proxy/stock/{symbol}/chart/{period}',
    method: 'GET',
    options: {
      handler: {
        proxy: {
          uri: environment.apiURL + '/beta/stock/{symbol}/chart/{period}?token=' + environment.apiKey,
          passThrough: true,
          xforward: true
        }
      }
    }
  });

  server.route({
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      return h.redirect('/404');
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();