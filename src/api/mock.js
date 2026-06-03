let todos = [];
let nextId = 1;

function generateId() {
  return String(nextId++);
}

const MOCK_USER = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

export function setupMock(client) {
  client.interceptors.request.use((config) => {
    const { method, url, data } = config;
    const body = data || {};

    if (method === 'post' && url === '/auth/login') {
      const { email, password } = body;
      if (email === 'test@example.com' && password === 'password') {
        config.adapter = () =>
          Promise.resolve({
            data: { success: true, token: 'mock-jwt-token', user: MOCK_USER },
            status: 200,
            statusText: 'OK',
          });
      } else {
        config.adapter = () =>
          Promise.reject({
            response: {
              status: 401,
              data: { message: 'Invalid email or password' },
            },
          });
      }
    }

    if (method === 'get' && url === '/auth/me') {
      config.adapter = () =>
        Promise.resolve({
          data: { user: MOCK_USER },
          status: 200,
          statusText: 'OK',
        });
    }

    if (method === 'post' && url === '/auth/logout') {
      config.adapter = () =>
        Promise.resolve({ data: { success: true }, status: 200, statusText: 'OK' });
    }

    if (method === 'get' && url === '/todos') {
      config.adapter = () =>
        Promise.resolve({
          data: { todos },
          status: 200,
          statusText: 'OK',
        });
    }

    if (method === 'post' && url === '/todos') {
      const todo = {
        id: generateId(),
        title: body.title,
        description: body.description || '',
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      todos.unshift(todo);
      config.adapter = () =>
        Promise.resolve({ data: { todo }, status: 201, statusText: 'Created' });
    }

    const putMatch = method === 'put' && url?.match(/^\/todos\/(.+)$/);
    if (putMatch) {
      const id = putMatch[1];
      const idx = todos.findIndex((t) => t.id === id);
      if (idx !== -1) {
        todos[idx] = { ...todos[idx], ...body, updatedAt: new Date().toISOString() };
        config.adapter = () =>
          Promise.resolve({
            data: { todo: todos[idx] },
            status: 200,
            statusText: 'OK',
          });
      } else {
        config.adapter = () =>
          Promise.reject({ response: { status: 404, data: { message: 'Todo not found' } } });
      }
    }

    const deleteMatch = method === 'delete' && url?.match(/^\/todos\/(.+)$/);
    if (deleteMatch) {
      const id = deleteMatch[1];
      todos = todos.filter((t) => t.id !== id);
      config.adapter = () =>
        Promise.resolve({ data: { success: true }, status: 200, statusText: 'OK' });
    }

    return config;
  });
}
