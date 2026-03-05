import { Container, getContainer } from "@cloudflare/containers";

export class SearchService extends Container {
  defaultPort = 8080;
  sleepAfter = "2m";
}

export default {
  async fetch(request, env) {
    const container = getContainer(env.SEARCH_SERVICE);
    return container.fetch(request);
  },
};
