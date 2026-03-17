import fp from 'fastify-plugin';
import mercurius from 'mercurius';
import { FastifyInstance } from 'fastify';
import { typeDefs } from '../graphql/schema';
import { resolvers } from '../graphql/resolvers';

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(mercurius, {
    schema: typeDefs,
    resolvers,
    graphiql: process.env.NODE_ENV !== 'production',
  });

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.send(error);
  });
});
