import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PropertyDto } from '../src/property/model/property.model';
import { postDemoDto } from './stub/postDemoDto';

describe('PropertyController (e2e)', () => {
  let app: INestApplication;
  let demoId: string;
  let savedProperty: { id: any; key: any };

  const newPostDemoDto = {
    ...postDemoDto,
    name: 'property controller stub',
    urlPrefix: 'propControllerStub',
  };

  let createdSafeProperties;

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

  it('/:demoId/safeProperties (GET)', () => {
    return request(app.getHttpServer())
      .get(`/demo/${demoId}/safeProperties`)
      .expect(200)
      .then((res) => {
        createdSafeProperties = res.body;
        expect(Array.isArray(createdSafeProperties)).toBeTruthy();
        //created 4 props but expected 2 from api (not safe properties)
        expect(createdSafeProperties.length).toBe(
          2 + 1,
        ); /* property upsert test added
           one more safe property to the database
           (there were 2 safe props before it ran)
           so this test should expect 3 safe properties */

        expect(
          createdSafeProperties.map(({ key, value }) => ({
            key,
            value,
          })),
        ).toMatchObject([
          ...newPostDemoDto.safeProperties,
          {
            key: 'key2',
            value: 'value2',
          },
        ]);
      });
  });

  it('/:demoId/safeProperties/:safePropertyId (DELETE) - remove safe property', () => {
    return request(app.getHttpServer())
      .delete(`/demo/${demoId}/safeProperties/${createdSafeProperties[0].id}`)
      .expect(200);
  });
});
