import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    process.env.API_KEY = process.env.API_KEY ?? 'test-api-key';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('x-api-key', process.env.API_KEY as string)
      .expect(200)
      .expect({ data: 'Hello World!' });
  });

  it('/ (GET) should return 401 when x-api-key is missing', () => {
    return request(app.getHttpServer()).get('/').expect(401);
  });
});
