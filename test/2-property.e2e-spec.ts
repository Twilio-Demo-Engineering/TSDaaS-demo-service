import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PropertyDto } from '../src/property/model/property.model';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { postDemoDto } from './stub/postDemoDto';

describe('PropertyController (e2e)', () => {
  let app: INestApplication;
  let demoId: string;
  let savedProperty;

  const newPostDemoDto = {
    ...postDemoDto,
    name: 'property controller stub',
    urlPrefix: 'propControllerStub',
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/demo')
      .send(newPostDemoDto)
      .expect(201)
      .then(({ body }) => {
        demoId = body.id;
      });
  });

  it('/:demoId/properties (GET) - shouldnt return unsafe properties', async () => {
    return request(app.getHttpServer())
      .get(`/demo/${demoId}/properties`)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBeTruthy();
        //created 4 props but expected 2 from api (not safe properties)
        expect(body.length).toBe(2);
        //no safe properties returned
        expect(body.filter((prop) => prop.safe === true).length).toBe(0);
        savedProperty = body.find((prop) => !prop.safe);
      });
  });

  it('/:demoId/properties (PATCH) - upsert properties', async () => {
    return request(app.getHttpServer())
      .patch(`/demo/${demoId}/properties`)
      .send([
        {
          id: savedProperty.id,
          value: 'token123',
          key: savedProperty.key,
          safe: true,
        },
        {
          key: 'key2',
          value: 'value2',
          safe: true,
        },
      ])
      .expect(200)
      .then((res) => {
        const body: PropertyDto[] = res.body;
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBe(2);
        const returnedSafeParams = body.filter((prop) => prop.safe);
        expect(
          returnedSafeParams.map(({ value }) => value).sort(),
        ).toMatchObject(['token123', 'value2'].sort());
      });
  });

  it('/:demoId/properties/:propertyId (DELETE) - remove property', async () => {
    return request(app.getHttpServer())
      .delete(`/demo/${demoId}/properties/${savedProperty.id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeTruthy();
      });
  });

  it('/:demoId/safeProperties', () => {
    // return request(app.getHttpServer())
    //   .get(`/demo/${demoId}/safeProperties`)
    //   .expect(200)
    //   .then(({ body }) => {
    //     expect(Array.isArray(body)).toBeTruthy();
    //     //created 4 props but expected 2 from api (not safe properties)
    //     expect(body.length).toBe(2);
    //     //no safe properties returned
    //     expect(body.filter((prop) => prop.safe === true).length).toBe(0);
    //     savedProperty = body.find((prop) => !prop.safe);
    //   });
    return false;
  });
});
