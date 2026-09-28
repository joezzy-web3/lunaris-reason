// api/[...slug].ts
// Vercel Catch-All Serverless Function for all /api/* requests
// Ensures entire API runs on only 1 serverless function under Vercel Hobby plan
import unifiedRouter from '../lib/api-handlers/router.ts';

export const config = {
  maxDuration: 30,
};

export default unifiedRouter;
