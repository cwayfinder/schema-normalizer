import { NodeDescription, ObjectNodeDescription } from '../../types/node-decription';
import { NormalizeContext, normalizeNode } from '../node.normalizer';
import { NodeSchema, ObjectNodeSchema } from '../../types/schema';

export function normalizeObject(ctx: NormalizeContext<ObjectNodeDescription>): ObjectNodeSchema {
  if (!ctx.rawSchema && ctx.nodeDescription.nullable) {
    return { resolverName: 'static', resolverData: null, coerced: ctx.rawSchema === undefined };
  }

  if (ctx.rawSchema && typeof ctx.rawSchema !== 'object') {
    throw new Error(`Invalid schema for "${ctx.nodeDescription.key}"`);
  }

  const rawSchema = (ctx.rawSchema || {}) as Record<string, unknown>;
  const resolverData: Record<string, NodeSchema> = {};
  for (const childNodeDescription of ctx.nodeDescription.children) {
    const childCtx: NormalizeContext<NodeDescription> = {
      ...ctx,
      nodeDescription: childNodeDescription,
      rawSchema: rawSchema[childNodeDescription.key],
    };
    resolverData[childNodeDescription.key] = normalizeNode(childCtx);
  }

  return { resolverName: 'static', resolverData, coerced: ctx.rawSchema === undefined };
}
