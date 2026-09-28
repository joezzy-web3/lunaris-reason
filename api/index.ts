// api/index.ts
// Single Unified Serverless Entrypoint for Root /api requests
import unifiedRouter from '../lib/api-handlers/router.ts';

export const config = {
  maxDuration: 30,
};

export default unifiedRouter;
