
import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

interface NestTestContext {
  testingApp: INestApplication;
  moduleFixture: TestingModule;
  httpServer: any;
}

declare module 'vitest' {
  export interface TestContext {
    nest?: NestTestContext;
  }
}
