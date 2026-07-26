import type { APIRoute } from 'astro';
import { getGraphProvider } from '../../../../lib/graph';

export const GET: APIRoute = async () => {
  const provider = await getGraphProvider();
  const nodes = provider.listNodes ? await provider.listNodes() : [];

  return new Response(
    JSON.stringify(
      {
        api_version: '1.0',
        provider: provider.name,
        count: nodes.length,
        items: nodes,
      },
      null,
      2,
    ),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
    },
  );
};
