const DB = {
  todos: [],
  nextId: 1,
};

const MOCK_USER = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

function matchRoute(method, url) {
  if (!url) return null;
  if (method === 'post' && url.endsWith('/auth/login')) return { handler: 'login' };
  if (method === 'get' && url.endsWith('/auth/me')) return { handler: 'me' };
  if (method === 'post' && url.endsWith('/auth/logout')) return { handler: 'logout' };
  if (method === 'get' && url.endsWith('/todos')) return { handler: 'getTodos' };
  if (method === 'post' && url.endsWith('/todos')) return { handler: 'createTodo' };
  const putMatch = method === 'put' && url.match(/\/todos\/([^/]+)$/);
  if (putMatch) return { handler: 'updateTodo', id: putMatch[1] };
  const deleteMatch = method === 'delete' && url.match(/\/todos\/([^/]+)$/);
  if (deleteMatch) return { handler: 'deleteTodo', id: deleteMatch[1] };
  return null;
}

export function setupMock(client) {
  client.interceptors.request.use((config) => {
    const route = matchRoute(config.method, config.url);
    if (!route) return config;

    const body = config.data || {};

    switch (route.handler) {
      case 'login': {
        const { email, password } = body;
        if (email === 'test@example.com' && password === 'password') {
          config.adapter = () => Promise.resolve({
            data: { success: true, token: 'mock-jwt-token', user: MOCK_USER },
            status: 200,
          });
        } else {
          config.adapter = () => Promise.reject({
            response: { status: 401, data: { message: 'Invalid email or password' } },
          });
        }
        break;
      }
      case 'me':
        config.adapter = () => Promise.resolve({
          data: { user: MOCK_USER },
          status: 200,
        });
        break;
      case 'logout':
        config.adapter = () => Promise.resolve({ data: { success: true }, status: 200 });
        break;
      case 'getTodos':
        config.adapter = () => Promise.resolve({
          data: { todos: DB.todos },
          status: 200,
        });
        break;
      case 'createTodo': {
        const todo = {
          id: String(DB.nextId++),
          title: body.title || '',
          description: body.description || '',
          status: 'Pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        DB.todos.unshift(todo);
        config.adapter = () => Promise.resolve({ data: { todo }, status: 201 });
        break;
      }
      case 'updateTodo': {
        const idx = DB.todos.findIndex((t) => t.id === route.id);
        if (idx !== -1) {
          DB.todos[idx] = { ...DB.todos[idx], ...body, updatedAt: new Date().toISOString() };
          config.adapter = () => Promise.resolve({ data: { todo: DB.todos[idx] }, status: 200 });
        } else {
          config.adapter = () => Promise.reject({
            response: { status: 404, data: { message: 'Todo not found' } },
          });
        }
        break;
      }
      case 'deleteTodo': {
        DB.todos = DB.todos.filter((t) => t.id !== route.id);
        config.adapter = () => Promise.resolve({ data: { success: true }, status: 200 });
        break;
      }
    }

    return config;
  });
}
