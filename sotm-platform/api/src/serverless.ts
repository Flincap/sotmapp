import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

/** Vercel serverless bootstrap. The Nest app (and its Mongoose connection)
    is created once per lambda instance and reused across invocations. */
let cachedServer: express.Express | null = null;

export async function getServer(): Promise<express.Express> {
  if (cachedServer) return cachedServer;
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  configureApp(app);
  await app.init();
  cachedServer = server;
  return cachedServer;
}
