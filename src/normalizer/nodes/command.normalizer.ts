import { CommandNodeDescription } from '../../types/node-decription';
import { NormalizeContext } from '../node.normalizer';
import { CommandNodeSchema, CommandSchema } from '../../types/schema';

export function normalizeCommand(ctx: NormalizeContext<CommandNodeDescription>): CommandNodeSchema {
  if (!ctx.rawSchema) {
    return { resolverName: 'static', resolverData: null, coerced: true };
  }

  if (typeof ctx.rawSchema === 'object' && 'runnerName' in ctx.rawSchema && 'runnerData' in ctx.rawSchema) {
    const rawCommandSchema = ctx.rawSchema;
    if (typeof rawCommandSchema.runnerName !== 'string') {
      throw new Error(`Command schema is invalid. Field "runnerName" must be string.`);
    }
    if (!rawCommandSchema.runnerData) {
      throw new Error(`Command schema is invalid. Field "runnerData" must be defined.`);
    }

    const commandSchema = rawCommandSchema as CommandSchema;
    return { resolverName: 'static', resolverData: commandSchema, coerced: false };
  }

  if (typeof ctx.rawSchema === 'function') {
    return {
      resolverName: 'static',
      resolverData: { runnerName: 'inline', runnerData: ctx.rawSchema },
      coerced: false,
    };
  }

  throw new Error(`Command schema is invalid. Got ${JSON.stringify(ctx.rawSchema)}.`);
}
