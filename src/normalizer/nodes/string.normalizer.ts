import { StringNodeDescription } from '../../types/node-decription';
import { NormalizeContext } from '../node.normalizer';
import { StringNodeSchema } from '../../types/schema';

export function normalizeString(ctx: NormalizeContext<StringNodeDescription>): StringNodeSchema {
  const resolverData = ctx.rawSchema ? String(ctx.rawSchema) : '';
  return { resolverName: 'static', resolverData, coerced: ctx.rawSchema === undefined };
}
