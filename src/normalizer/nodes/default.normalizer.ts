import { NodeDescriptions } from '../../types/node-decription';
import { NormalizeContext } from '../node.normalizer';
import { NodeSchema } from '../../types/schema';

export function normalizeDefault(ctx: NormalizeContext<NodeDescriptions>): NodeSchema {
  return { resolverName: 'static', resolverData: ctx.rawSchema, coerced: ctx.rawSchema === undefined };
}
