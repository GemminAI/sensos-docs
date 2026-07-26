import type { APIRoute } from 'astro';
import { getAllRfcs, rfcHref } from '../../../../lib/rfc';
import { SITE } from '../../../../lib/site';

export async function getStaticPaths() {
  const rfcs = await getAllRfcs();
  return rfcs.map((rfc) => ({
    params: { id: rfc.id },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const rfcs = await getAllRfcs();
  const rfc = rfcs.find((entry) => entry.id === params.id);

  if (!rfc) {
    return new Response(JSON.stringify({ error: 'RFC not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const body = {
    api_version: '1.0',
    id: rfc.id,
    title: rfc.data.title,
    status: rfc.data.status,
    category: rfc.data.category,
    version: rfc.data.version,
    updated: rfc.data.updated,
    repository: rfc.data.repository,
    supersedes: rfc.data.supersedes,
    superseded_by: rfc.data.superseded_by,
    related: rfc.data.related,
    canonical_url: `${SITE.url}${rfcHref(rfc.id)}`,
    markdown_path: `docs/rfc/${rfc.id}.md`,
    markdown: rfc.body,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
