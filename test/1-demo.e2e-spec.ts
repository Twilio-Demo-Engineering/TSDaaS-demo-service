import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UpdateDemoDto } from 'src/demo/model/demo.model';
import { AppModule } from '../src/app.module';
import { postDemoDto } from './stub/postDemoDto';

describe('DemoController (e2e)', () => {
  let app: INestApplication;
  let demoId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST) OK', async () => {
    // create new demo with status 201
    return request(app.getHttpServer())
      .post('/demo')
      .send(postDemoDto)
      .expect(201)
      .then(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBe(postDemoDto.name);
        // check if safe properties are hidden from res.body.onse
        expect(body.properties.length).toBe(2);
        // sets newly created globally
        demoId = body.id;
      });
  });

  it('/ (POST) 409 - no duplicate demos', async () => {
    return request(app.getHttpServer())
      .post('/demo')
      .send(postDemoDto)
      .expect(409);
  });

  it('/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/demo')
      .query({ crudQuery: { where: { name: postDemoDto.name } } })
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBeTruthy();
        expect(body[0].name).toBe(postDemoDto.name);
      });
  });

  it('/:id (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/demo/${demoId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.name).toBe(postDemoDto.name);
        expect(body.properties.length).toBe(2);
      });
  });

  it('/:id (GET) - not found', () => {
    return request(app.getHttpServer()).get('/demo/foobar').expect(404);
  });

  it('/:id (PATCH)', async () => {
    console.log(`/demo/${demoId}`);
    // test patch one demo prop
    await request(app.getHttpServer())
      .patch(`/demo/${demoId}`)
      .set('Accept', 'application/json')
      .send({ name: 'akjahdfhaskjehyaluifghasydfruhasdkjfhl' })
      .expect(200)
      .then((res) => {
        const body: UpdateDemoDto = res.body;
        expect(body.name).toBe('akjahdfhaskjehyaluifghasydfruhasdkjfhl'); //check first prop change
        expect(body.urlPrefix).toBe(postDemoDto.urlPrefix);
        expect(body.authors).toBe(postDemoDto.authors);
        expect(body.revisionNumber).toBe(postDemoDto.revisionNumber);
      });

    // test patch another demo property
    return request(app.getHttpServer())
      .patch(`/demo/${demoId}`)
      .set('Accept', 'application/json')
      .send({ urlPrefix: 'dev.demo2' })
      .expect(200)
      .then((res) => {
        const body: UpdateDemoDto = res.body;
        expect(body.name).toBe('akjahdfhaskjehyaluifghasydfruhasdkjfhl'); //first prop still changed
        expect(body.urlPrefix).toBe('dev.demo2'); //check second prop change
        expect(body.authors).toBe(postDemoDto.authors);
        expect(body.revisionNumber).toBe(postDemoDto.revisionNumber);
      });
  });

  it('/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/demo/${demoId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeTruthy();
      });
    return request(app.getHttpServer()).get(`/demo/${demoId}`).expect(404);
  });
});
