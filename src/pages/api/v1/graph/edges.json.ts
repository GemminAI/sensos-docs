import type { APIRoute } from 'astro';
import { getGraphProvider } from '../../../../lib/graph';

export const GET: APIRoute = async () => {
  const provider = await getGraphProvider();
  const edges = provider.listEdges ? await provider.listEdges() : [];

  return new Response(
    JSON.stringify(
      {
        api_version: '1.0',
        provider: provider.name,
        count: edges.length,
        items: edges,
        relationship_types: [...new Set(edges.map((edge) => String(edge.type)))].sort(),
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
