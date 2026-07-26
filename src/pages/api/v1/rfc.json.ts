import type { APIRoute } from 'astro';
import { formatDate, getAllRfcs, rfcHref } from '../../../lib/rfc';
import { SITE } from '../../../lib/site';

export const GET: APIRoute = async () => {
  const rfcs = await getAllRfcs();

  const body = {
    api_version: '1.0',
    generated_at: new Date().toISOString(),
    canonical_base: SITE.url,
    count: rfcs.length,
    items: rfcs.map((rfc) => ({
      id: rfc.id,
      title: rfc.data.title,
      status: rfc.data.status,
      category: rfc.data.category,
      version: rfc.data.version,
      updated: formatDate(rfc.data.updated),
      repository: rfc.data.repository,
      supersedes: rfc.data.supersedes,
      superseded_by: rfc.data.superseded_by,
      related: rfc.data.related,
      canonical_url: `${SITE.url}${rfcHref(rfc.id)}`,
      detail_url: `${SITE.url}/api/v1/rfc/${rfc.id}.json`,
      markdown_path: `docs/rfc/${rfc.id}.md`,
    })),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
