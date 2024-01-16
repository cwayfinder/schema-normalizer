import { BooleanNodeDescription } from '../../types/node-decription';
import { NormalizeContext } from '../node.normalizer';
import { BooleanNodeSchema } from '../../types/schema';

export function normalizeBoolean(ctx: NormalizeContext<BooleanNodeDescription>): BooleanNodeSchema {
  return {
    resolverName: 'static',
    resolverData: !!ctx.rawSchema,
    coerced: ctx.rawSchema === undefined,
    inverted: ctx.inverted,
  };
}
