import { rest } from 'msw';

let mockUsers = [
  {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ROLE_ADMIN',
    jwt: 'fake-admin-token',
  },
  {
    id: 2,
    fullName: 'Customer User',
    email: 'user@example.com',
    password: 'user123',
    role: 'ROLE_CUSTOMER',
    jwt: 'fake-user-token',
  },
];

let mockTasks = [];
let mockSubmissions = [];

export const handlers = [
  rest.post('/auth/signin', async (req, res, ctx) => {
    const { email, password } = await req.json();
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      return res(
        ctx.status(200),
        ctx.set('Content-Type', 'application/json'),
        ctx.body(JSON.stringify({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          jwt: user.jwt,
        }))
      );
    }
    return res(
      ctx.status(401),
      ctx.set('Content-Type', 'application/json'),
      ctx.body(JSON.stringify({ error: 'Invalid credentials' }))
    );
  }),

  rest.post('/auth/signup', async (req, res, ctx) => {
    const { fullName, email, password, role } = await req.json();
    const exists = mockUsers.find(u => u.email === email);
    if (exists) {
      return res(
        ctx.status(409),
        ctx.set('Content-Type', 'application/json'),
        ctx.body(JSON.stringify({ error: 'User exists' }))
      );
    }
    const newUser = {
      id: Date.now(),
      fullName,
      email,
      password,
      role,
      jwt: 'fake-token-' + Date.now(),
    };
    mockUsers.push(newUser);
    return res(
      ctx.status(201),
      ctx.set('Content-Type', 'application/json'),
      ctx.body(JSON.stringify({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        jwt: newUser.jwt
      }))
    );
  }),

  rest.get('/api/users/profile', async (req, res, ctx) => {
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;
    const user = mockUsers.find(u => u.jwt === token);
    if (user) {
      return res(
        ctx.status(200),
        ctx.set('Content-Type', 'application/json'),
        ctx.body(JSON.stringify({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        }))
      );
    }
    return res(ctx.status(403), ctx.set('Content-Type', 'application/json'), ctx.body(JSON.stringify({ error: 'Unauthorized' })));
  }),

  rest.get('/api/users', (req, res, ctx) => {
    const users = mockUsers.map(u => ({ id: u.id, fullName: u.fullName, email: u.email, role: u.role }));
    return res(ctx.status(200), ctx.set('Content-Type', 'application/json'), ctx.body(JSON.stringify(users)));
  }),

  rest.post('/api/tasks', async (req, res, ctx) => {
    const task = await req.json();
    const newTask = { ...task, id: Date.now() };
    mockTasks.push(newTask);
    return res(ctx.status(201), ctx.set('Content-Type', 'application/json'), ctx.body(JSON.stringify(newTask)));
  }),

  rest.get('/api/tasks', (req, res, ctx) => res(ctx.status(200), ctx.set('Content-Type', 'application/json'), ctx.body(JSON.stringify(mockTasks)))),

  rest.get('/api/tasks/user', (req, res, ctx) => res(ctx.status(200), ctx.set('Content-Type', 'application/json'), ctx.body(JSON.stringify(mockTasks)))),

  rest.get('/api/tasks/:id', (req, res, ctx) => {
    const task = mockTasks.find(t => t.id === +req.params.id);
    return task
      ? res(ctx.status(200), ctx.set('Content-Type', 'application/json'), ctx.body(JSON.stringify(task)))
      : res(ctx.status(404), ctx.set('Content-Type', 'application/json'), ctx.body(JSON.stringify({ error: 'Task not found' })));
  }),

  rest.put('/api/tasks/:id', async (req, res, ctx) => {
    const updated = await req.json();
    mockTasks = mockTasks.map(t => t.id === +req.params.id ? { ...t, ...updated } : t);
    return res(ctx.status(200), ctx.set('Content-Type', 'application/json'), ctx.body(JSON.stringify(updated)));
  }),

  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    mockTasks = mockTasks.filter(t => t.id !== +req.params.id);
    return res(ctx.status(200));
  }),

  rest.put('/api/tasks/:taskId/user/:userId/assigned', (req, res, ctx) => {
    return res(ctx.status(200), ctx.set('Content-Type', 'application/json'), ctx.body(JSON.stringify({ message: 'Assigned' })));
  }),

  rest.post('/api/submissions', async (req, res, ctx) => {
    const taskId = new URL(req.url).searchParams.get('task_id');
    const githubLink = new URL(req.url).searchParams.get('github_link');
    const newSubmission = {
      id: Date.now(),
      taskId,
      githubLink,
      submissionTime: new Date().toISOString(),
      status: "PENDING"
    };
    mockSubmissions.push(newSubmission);
    return res(ctx.status(201), ctx.set('Content-Type', 'application/json'), ctx.body(JSON.stringify(newSubmission)));
  }),

  rest.get('/api/submissions/task/:taskId', (req, res, ctx) => {
    const taskId = req.params.taskId;
    const result = mockSubmissions.filter(s => s.taskId === taskId);
    return res(ctx.status(200), ctx.set('Content-Type', 'application/json'), ctx.body(JSON.stringify(result)));
  }),

  rest.put('/api/submissions/:id', (req, res, ctx) => {
    const status = new URL(req.url).searchParams.get('status');
    const id = +req.params.id;
    mockSubmissions = mockSubmissions.map(s => s.id === id ? { ...s, status } : s);
    const updated = mockSubmissions.find(s => s.id === id);
    return res(ctx.status(200), ctx.set('Content-Type', 'application/json'), ctx.body(JSON.stringify(updated)));
  }),
];