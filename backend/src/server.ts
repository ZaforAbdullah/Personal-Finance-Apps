import 'reflect-metadata';
import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import { config } from './config';
import { sequelize } from './models';
import corsPlugin from './plugins/cors';
import graphqlPlugin from './plugins/graphql';

export async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: config.nodeEnv === 'production' ? 'warn' : 'info',
      transport: config.nodeEnv === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
    },
  });

  // Security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: false, // Disabled for GraphiQL
  });

  // CORS
  await fastify.register(corsPlugin);

  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // GraphQL
  await fastify.register(graphqlPlugin);

  // Database connection
  await sequelize.authenticate();
  fastify.log.info('Database connection established');

  return fastify;
}
