import { createRouteHandler } from 'uploadthing/next';
import { env } from '~/env';
import { ourFileRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    // The URL to where the route handler is hosted
    // UploadThing attempts to automatically detect this value based on the request URL and headers
    // However, the automatic detection fails in docker deployments
    // docs: https://docs.uploadthing.com/api-reference/server#config
    callbackUrl: env.PUBLIC_URL && `${env.PUBLIC_URL}/api/uploadthing`,
  },
});
