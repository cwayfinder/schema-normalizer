import { ArrayNodeDescription, NodeDescription } from '../../types/node-decription';
import { NormalizeContext, normalizeNode } from '../node.normalizer';
import { ArrayNodeSchema } from '../../types/schema';

export function normalizeArray(ctx: NormalizeContext<ArrayNodeDescription>): ArrayNodeSchema {
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

  const resolverData = ctx.rawSchema.map((itemSchema) => {
    const itemCtx: NormalizeContext<NodeDescription> = {
      ...ctx,
      rawSchema: itemSchema,
      nodeDescription: ctx.nodeDescription.items,
    };
    return normalizeNode(itemCtx);
  });

  return { resolverName: 'static', resolverData, coerced: false };
}
