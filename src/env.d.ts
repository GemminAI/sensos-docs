/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { GraphMetadata, GraphNode, GraphProvider } from './lib/graph/types';

declare global {
  interface Window {
    __SENSOS_GRAPH_PROVIDER__?: GraphProvider;
    __SENSOS_GRAPH_METADATA__?: GraphMetadata;
    __SENSOS_GRAPH_SELECTED__?: GraphNode;
    __SENSOS_GRAPH_FOCUS__?: Record<string, string | undefined>;
    __SENSOS_GRAPH_HAS_JSON__?: boolean;
  }
}

export {};
