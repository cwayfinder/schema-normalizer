import { NumberNodeDescription } from '../../types/node-decription';
import { NormalizeContext } from '../node.normalizer';
import { NumberNodeSchema } from '../../types/schema';

export function normalizeNumber(ctx: NormalizeContext<NumberNodeDescription>): NumberNodeSchema {
  const result = Number(ctx.rawSchema);
  const resolverData = result || 0;
  return { resolverName: 'static', resolverData, coerced: ctx.rawSchema === undefined };
}
