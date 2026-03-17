import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';
import { config } from '../config';

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(cors, {
    origin: config.cors.origin,
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  });
});
