import type { APIRoute } from 'astro';
import { getGraphProvider } from '../../../../lib/graph';

export const GET: APIRoute = async () => {
  const provider = await getGraphProvider();
  const metadata = await provider.getMetadata();

  return new Response(JSON.stringify(metadata, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
};
