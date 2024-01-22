import { ComponentRawSchema } from '../types/schema';
import { NormalizeContext, normalizeNode } from './node.normalizer';
import { NodeDescription } from '../types/node-decription';
import { InstanceSchema } from '../mobx/instance-schema';
import { Store } from '../mobx/store';
import { NodeDefinition } from '../mobx/types';

export function normalizeSchema(rawSchema: ComponentRawSchema, rootNodeDescription: NodeDescription, store: Store): InstanceSchema {
  const ctx: NormalizeContext<NodeDescription> = {
    store,
    nodeDescription: rootNodeDescription,
    rawSchema: rawSchema,
  };
  const rootNodeSchema = normalizeNode(ctx);
  const root: NodeDefinition = { description: rootNodeDescription, schema: rootNodeSchema };

  return new InstanceSchema(root, ctx.components, ctx.customIds);
}
