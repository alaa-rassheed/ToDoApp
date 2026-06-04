'use strict';

const catalyst = require('zcatalyst-sdk-node');

module.exports = (req, res) => {
  const method = req.method;
  const url = req.url;
  const segments = url.split('/').filter(Boolean);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', async () => {
    const data = body ? JSON.parse(body) : {};
    const app = catalyst.initialize(req);

    try {
      // Auth routes
      if (method === 'POST' && url.endsWith('/auth/login')) {
        const { email, password } = data;
        // TODO: validate credentials against Catalyst Data Store
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          token: 'jwt_token_here',
          user: { id: '1', name: 'User', email },
        }));
        return;
      }

      if (method === 'POST' && url.endsWith('/auth/signup')) {
        const { name, email, password } = data;
        // TODO: create user in Catalyst Data Store
        res.writeHead(201);
        res.end(JSON.stringify({
          success: true,
          token: 'jwt_token_here',
          user: { id: '1', name, email },
        }));
        return;
      }

      if (method === 'GET' && url.endsWith('/auth/me')) {
        // TODO: verify JWT token from Authorization header
        res.writeHead(200);
        res.end(JSON.stringify({ user: { id: '1', name: 'User', email: 'user@example.com' } }));
        return;
      }

      if (method === 'POST' && url.endsWith('/auth/logout')) {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
        return;
      }

      // Todo routes
      if (method === 'GET' && url.endsWith('/todos')) {
        const table = app.datastore().table('Todos');
        const rows = await table.getAllRows();
        res.writeHead(200);
        res.end(JSON.stringify({ todos: rows }));
        return;
      }

      if (method === 'POST' && url.endsWith('/todos')) {
        const table = app.datastore().table('Todos');
        const row = await table.insertRow(data);
        res.writeHead(201);
        res.end(JSON.stringify({ todo: row }));
        return;
      }

      const putMatch = url.match(/\/todos\/([^/]+)$/);
      if (method === 'PUT' && putMatch) {
        const id = putMatch[1];
        const table = app.datastore().table('Todos');
        const row = await table.updateRow({ ...data, ROWID: id });
        res.writeHead(200);
        res.end(JSON.stringify({ todo: row }));
        return;
      }

      const deleteMatch = url.match(/\/todos\/([^/]+)$/);
      if (method === 'DELETE' && deleteMatch) {
        const id = deleteMatch[1];
        const table = app.datastore().table('Todos');
        await table.deleteRow(id);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
        return;
      }

      res.writeHead(404);
      res.end(JSON.stringify({ message: 'Not found' }));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ message: err.message || 'Internal server error' }));
    }
  });
};
