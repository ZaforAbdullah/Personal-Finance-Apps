import { buildServer } from './server';
import { config } from './config';

async function main() {
  const server = await buildServer();

  try {
    await server.listen({ port: config.port, host: config.host });
    server.log.info(`Server running at http://${config.host}:${config.port}`);
    server.log.info(`GraphQL playground: http://${config.host}:${config.port}/graphiql`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

main();
