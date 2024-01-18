import { ComponentRawSchema } from '../types/schema';
import { NormalizeContext } from './node.normalizer';
import { ComponentNodeDescription } from '../types/node-decription';
import { normalizeComponent} from './nodes/component.normalizer';
import { InstanceSchema } from '../mobx/instance-schema';
import { Store } from '../mobx/store';
import {normalizeSchema} from "./nodes/schema-normalizer";

export function normalizeInstance(rawSchema: ComponentRawSchema, store: Store): InstanceSchema {
  const ctx: NormalizeContext<ComponentNodeDescription> = {
    store,
    nodeDescription: { type: 'component' },
    rawSchema: rawSchema,
  };
  const rootId = normalizeSchema(ctx).resolverData as string;

  return new InstanceSchema(ctx.components, rootId, ctx.customIds);
}
