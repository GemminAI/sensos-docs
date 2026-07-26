import type { APIRoute } from 'astro';
import { getGraphProvider } from '../../../../../lib/graph';

function isSafeStaticPathId(id: string): boolean {
  // Avoid characters that break static file emission (e.g. ':').
  // '/' is allowed via rest params.
  return !/[?:#*|"<>\\]/.test(id);
}

export async function getStaticPaths() {
  const provider = await getGraphProvider();
  const nodes = provider.listNodes ? await provider.listNodes() : [];
  return nodes
    .filter((node) => isSafeStaticPathId(node.id))
    .map((node) => ({
      // Rest param accepts repository ids containing '/'.
      params: { id: node.id },
    }));
}

export const GET: APIRoute = async ({ params }) => {
  const provider = await getGraphProvider();
  const id = Array.isArray(params.id) ? params.id.join('/') : (params.id ?? '');
  const node = await provider.getNode(id);

  if (!node) {
    return new Response(JSON.stringify({ error: 'Node not found', id }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const neighbors = await provider.getNeighbors(node.id);

  return new Response(
    JSON.stringify(
      {
        api_version: '1.0',
        provider: provider.name,
        node,
        neighbors,
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
