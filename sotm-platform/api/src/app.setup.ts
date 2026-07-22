import { INestApplication, ValidationPipe } from '@nestjs/common';

/** Shared configuration applied by both the classic server (main.ts) and the
    Vercel serverless entry (serverless.ts), so behavior never drifts. */
export function configureApp(app: INestApplication): void {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors(
    allowedOrigins.length > 0
      ? {
          origin: (
            origin: string | undefined,
            callback: (err: Error | null, allow?: boolean) => void,
          ) => {
            if (!origin || allowedOrigins.includes(origin)) {
              return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
          },
          credentials: true,
        }
      : { origin: '*' },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
}
