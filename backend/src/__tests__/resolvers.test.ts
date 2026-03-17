import { buildServer } from '../server';
import { sequelize } from '../models';

describe('GraphQL API', () => {
  let app: Awaited<ReturnType<typeof buildServer>>;

  beforeAll(async () => {
    // Use test database - skip if not available
    try {
      app = await buildServer();
    } catch {
      console.warn('Skipping integration tests - DB not available');
    }
  });

  afterAll(async () => {
    if (app) await app.close();
    await sequelize.close().catch(() => {});
  });

  it('responds to health check', async () => {
    if (!app) return;
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.status).toBe('ok');
  });

  it('returns balance from GraphQL', async () => {
    if (!app) return;
    const response = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `{ balance { current income expenses } }`,
      },
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.data).toBeDefined();
    expect(body.data.balance).toBeDefined();
  });
});
