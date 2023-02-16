import request from 'supertest';
import { testingModule } from '@/utility/app';

const url = '/api/media';

export const initialize = async () => {
  const { testingApp, moduleFixture } = await testingModule();
  return {
    testingApp,
    moduleFixture,
  };
};

export const postMedia = async () => {
  const { testingApp } = await initialize();
  const { body } = await request(testingApp.getHttpServer())
    .post(`${url}`)
    .set('Content-Type', 'multipart/form-data')
    .attach('media', 'public/logo.png')
    .expect(201);
  return body;
};

export const getMedia = async () => {
  const {
    data: { id },
  } = await postMedia();
  const { testingApp } = await initialize();
  const { body } = await request(testingApp.getHttpServer())
    .get(`${url}/${id}`)
    .expect(200);
  return body;
};

describe('MediaController (e2e)', () => {
  it(`${url} (POST)`, postMedia);

  it(`${url} (GET)`, getMedia);
});
