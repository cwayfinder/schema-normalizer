import { ArrayNodeDescription, NodeDescription } from '../../types/node-decription';
import { NormalizeContext } from '../node.normalizer';
import { ArrayNodeSchema, NodeSchema } from '../../types/schema';

export function normalizeArray(ctx: NormalizeContext<ArrayNodeDescription>, queue: NormalizeContext<NodeDescription>[]): ArrayNodeSchema {
  if (!ctx.rawSchema) {
    return { resolverName: 'static', resolverData: [], coerced: ctx.rawSchema === undefined };
  }

  if (!Array.isArray(ctx.rawSchema)) {
    throw new Error(
      `Array node schema "${JSON.stringify(ctx.nodeDescription)}" must be an array. Got ${JSON.stringify(
        ctx.rawSchema,
      )} instead.`,
    );
  }

  const resolverData: NodeSchema[] = [];
  for (const itemRawSchema of ctx.rawSchema) {
    const itemCtx: NormalizeContext<NodeDescription> = {
      ...ctx,
      rawSchema: itemRawSchema,
      nodeDescription: ctx.nodeDescription.items,
      insert: nodeSchema => resolverData.push(nodeSchema),
    };
    queue.push(itemCtx);
  }

  return { resolverName: 'static', resolverData, coerced: false };
}
