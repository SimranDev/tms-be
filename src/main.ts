import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for local frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.info(`Server is running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Error starting the server:', err);
});
