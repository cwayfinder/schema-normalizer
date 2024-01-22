import { MapNodeDescription, NodeDescription } from '../../types/node-decription';
import { NormalizeContext, normalizeNode } from '../node.normalizer';
import { MapNodeSchema, NodeSchema } from '../../types/schema';

export function normalizeMap(ctx: NormalizeContext<MapNodeDescription>, queue: NormalizeContext<NodeDescription>[]): MapNodeSchema {
  if (!ctx.rawSchema) {
    return { resolverName: 'static', resolverData: {}, coerced: ctx.rawSchema === undefined };
  }

  if (ctx.rawSchema && typeof ctx.rawSchema !== 'object') {
    throw new Error(`Invalid schema for "${ctx.nodeDescription.key}"`);
  }

  const rawSchema = (ctx.rawSchema || {}) as Record<string, unknown>;
  const resolverData: Record<string, NodeSchema> = {};

  for (const [key, value] of Object.entries(rawSchema)) {
    const childCtx: NormalizeContext<NodeDescription> = {
      ...ctx,
      nodeDescription: ctx.nodeDescription.item,
      rawSchema: value,
      insert: nodeSchema => resolverData[key] = nodeSchema,
    };
    queue.push(childCtx);
  }

  return { resolverName: 'static', resolverData, coerced: ctx.rawSchema === undefined };
}
