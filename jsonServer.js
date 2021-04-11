// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const cors = require('cors');

// const middlewares = jsonServer.defaults({ noCors: false })

// server.use(middlewares)
server.use(cors());
server.use(router)
server.listen(3002, () => {
  console.log('JSON Server is running')
})