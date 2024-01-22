import { NormalizeContext, normalizeNode } from './node.normalizer';
import { NodeDescription } from '../types/node-decription';
import { InstanceSchema } from '../mobx/instance-schema';
import { Store } from '../mobx/store';
import { NodeDefinition } from '../mobx/types';

export function normalizeSchema(rawSchema: unknown, rootNodeDescription: NodeDescription, store: Store): InstanceSchema {
  console.log('normalizeSchema1');
  let instanceSchema: InstanceSchema;

  const queue: NormalizeContext<NodeDescription>[] = [];

  const ctx: NormalizeContext<NodeDescription> = {
    store,
    nodeDescription: rootNodeDescription,
    rawSchema,
    insert: nodeSchema => {
      const root: NodeDefinition = { description: rootNodeDescription, schema: nodeSchema };
      instanceSchema = new InstanceSchema(root, ctx.components, ctx.customIds);
    }
  };
  queue.push(ctx);

  while (queue.length > 0) {
    const ctx = queue.shift()!;
    const nodeSchema = normalizeNode(ctx, queue);
    ctx.insert(nodeSchema);
  }

  return instanceSchema!;
}
