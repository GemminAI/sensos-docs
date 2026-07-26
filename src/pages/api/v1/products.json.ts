import type { APIRoute } from 'astro';
import { PRODUCTS, SITE } from '../../../lib/site';

export const GET: APIRoute = async () => {
  const body = {
    api_version: '1.0',
    generated_at: new Date().toISOString(),
    canonical_base: SITE.url,
    count: PRODUCTS.length,
    items: PRODUCTS.map((product) => ({
      slug: product.slug,
      name: product.name,
      summary: product.summary,
      status: product.status,
      repository: product.repository,
      repository_url: `https://github.com/${product.repository}`,
      docs_url: `${SITE.url}${product.docsHref}`,
    })),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
