import request from 'supertest';
import app from '../api/index.js';
import { reset } from '../api/service.js';

const postTry = async (path, status, payload, token) => sendTry('post', path, status, payload, token);
const getTry = async (path, status, payload, token) => sendTry('get', path, status, payload, token);
const putTry = async (path, status, payload, token) => sendTry('put', path, status, payload, token);

const sendTry = async (typeFn, path, status = 200, payload = {}, token = null) => {
  let req = request(app);
  if (typeFn === 'post') {
    req = req.post(path);
  } else if (typeFn === 'get') {
    req = req.get(path);
  } else if (typeFn === 'delete') {
    req = req.delete(path);
  } else if (typeFn === 'put') {
    req = req.put(path);
  }
  if (token !== null) {
    req = req.set('Authorization', `Bearer ${token}`);
  }
  const response = await req.send(payload);
  expect(response.statusCode).toBe(status);
  return response.body;
};

const validToken = async () => {
  const { token } = await postTry('/admin/auth/login', 200, {
    email: 'test.user@presto.app',
    password: 'TestPassword123!',
  });
  return token;
}

describe('Test the root path', () => {

  beforeAll(async () => {
    await reset();
  });

  /***************************************************************
                       Auth Tests
  ***************************************************************/

  test('Registration of initial user', async () => {
    const body = await postTry('/admin/auth/register', 200, {
      email: 'test.user@presto.app',
      password: 'TestPassword123!',
      name: 'Test User',
    });
    expect(typeof body.token).toBe('string');
  });

  test('Inability to re-register a user', async () => {
    await postTry('/admin/auth/register', 400, {
      email: 'test.user@presto.app',
      password: 'TestPassword123!',
      name: 'Test User',
    });
  });

  test('Login to an existing user', async () => {
    const body = await postTry('/admin/auth/login', 200, {
      email: 'test.user@presto.app',
      password: 'TestPassword123!',
    });
    expect(typeof body.token).toBe('string');
  });

  test('Login attempt with invalid credentials 1', async () => {
    await postTry('/admin/auth/login', 400, {
      email: 'missing@example.com',
      password: 'TestPassword123!',
    });
  });

  test('Login attempt with invalid credentials 2', async () => {
    await postTry('/admin/auth/login', 400, {
      email: 'test.user@presto.app',
      password: 'WrongPassword123!',
    });
  });

  test('Logout a valid session', async () => {
    const bodyLogout = await postTry('/admin/auth/logout', 200, {}, await validToken());
    expect(bodyLogout).toMatchObject({});
  });

  test('Logout a session without auth token', async () => {
    const body = await postTry('/admin/auth/logout', 403, {});
    expect(body).toMatchObject({});
  });

  /***************************************************************
                       Store Tests
  ***************************************************************/
  
  const STORE_1 = {
    name: 'Sample presentation',
    height: 100,
  }

  test('Initially there is an empty store', async () => {
    const body = await getTry('/store', 200, {}, await validToken());
    expect(body.store).toMatchObject({});
  });

  test('Adding to the store', async () => {
    const res = await putTry('/store', 200, { store: STORE_1 }, await validToken());
    expect(res).toMatchObject({});
  });

  test('Check if the store was updated', async () => {
    const body = await getTry('/store', 200, {}, await validToken());
    expect(body.store).toMatchObject(STORE_1);
  });

});
