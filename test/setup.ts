import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { bootstrapApp } from '@/utility/app';
import { NestTestContext } from 'types';

let currentContext: NestTestContext | undefined;

beforeAll(async function () {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const testingApp = moduleFixture.createNestApplication();
  bootstrapApp(testingApp);
  await testingApp.init();
  currentContext = {
    testingApp: testingApp,
    moduleFixture: moduleFixture,
    httpServer: testingApp.getHttpServer(),
  };
});

beforeEach(function (context) {
  context.nest = currentContext;
});

afterAll(() => {
  currentContext.testingApp.close();
  vi.resetModules();
});
