import request from 'supertest';
import { strict as assert } from 'node:assert';

describe('AppController (e2e)', () => {
  it.skip('/ (GET)', ({ nest: httpServer }) => {
    return request(httpServer)
      .get('/')
      .expect(200)
      .then(async ({ body }) => {
        assert.deepEqual(body.data, 'userModule');
      });
  });
});
