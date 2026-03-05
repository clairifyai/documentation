import { Container, getContainer } from "@cloudflare/containers";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export class SearchService extends Container {
  defaultPort = 8080;
  sleepAfter = "2m";

  constructor(ctx, env) {
    super(ctx, env);
    this.envVars = {
      OPENAI_API_KEY: env.OPENAI_API_KEY,
      ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY,
      QDRANT_URL: env.QDRANT_URL,
      QDRANT_API_KEY: env.QDRANT_API_KEY,
      QDRANT_COLLECTION: env.QDRANT_COLLECTION,
    };
  }
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const container = getContainer(env.SEARCH_SERVICE);
    await container.start();
    const response = await container.fetch(request);

    // Attach CORS headers to every response
    const newHeaders = new Headers(response.headers);
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      newHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
