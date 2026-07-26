import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { GraphArtifactFlags } from './types';

export const GRAPH_PUBLIC_DIR = 'public/graph';
export const GRAPH_BASE_URL = '/graph';

const FILES = {
  graphJson: 'graph.json',
  nodesJson: 'nodes.json',
  edgesJson: 'edges.json',
  metadataJson: 'metadata.json',
  graphHtml: 'graph.html',
  report: 'GRAPH_REPORT.md',
} as const;

export type GraphArtifactUrls = {
  graphJson: string;
  nodesJson: string;
  edgesJson: string;
  metadataJson: string;
  graphHtml: string;
  report: string;
};

export type DetectedGraphArtifacts = GraphArtifactFlags & {
  urls: GraphArtifactUrls;
  ready: boolean;
  /** @deprecated use graphHtml */
  html: boolean;
  /** @deprecated use graphJson */
  json: boolean;
  htmlUrl: string;
  jsonUrl: string;
  reportUrl: string;
};

export function detectGraphArtifacts(cwd = process.cwd()): DetectedGraphArtifacts {
  const dir = join(cwd, GRAPH_PUBLIC_DIR);
  const flags: GraphArtifactFlags = {
    graphJson: existsSync(join(dir, FILES.graphJson)),
    nodesJson: existsSync(join(dir, FILES.nodesJson)),
    edgesJson: existsSync(join(dir, FILES.edgesJson)),
    metadataJson: existsSync(join(dir, FILES.metadataJson)),
    graphHtml: existsSync(join(dir, FILES.graphHtml)),
    report: existsSync(join(dir, FILES.report)),
  };

  const urls: GraphArtifactUrls = {
    graphJson: `${GRAPH_BASE_URL}/${FILES.graphJson}`,
    nodesJson: `${GRAPH_BASE_URL}/${FILES.nodesJson}`,
    edgesJson: `${GRAPH_BASE_URL}/${FILES.edgesJson}`,
    metadataJson: `${GRAPH_BASE_URL}/${FILES.metadataJson}`,
    graphHtml: `${GRAPH_BASE_URL}/${FILES.graphHtml}`,
    report: `${GRAPH_BASE_URL}/${FILES.report}`,
  };

  return {
    ...flags,
    urls,
    ready: Object.values(flags).some(Boolean),
    html: flags.graphHtml,
    json: flags.graphJson,
    htmlUrl: urls.graphHtml,
    jsonUrl: urls.graphJson,
    reportUrl: urls.report,
  };
}
