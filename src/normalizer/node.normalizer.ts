import { NodeSchema } from '../types/schema';
import { Store } from '../mobx/store';
import { ComponentSchema } from '../mobx/component-schema';
import { NodeDescription } from '../types/node-decription';
import { registry } from './registry';
import { ComponentSchemaId } from '../mobx/types';

export interface NormalizeContext<TDescription extends NodeDescription> {
  readonly store: Store;
  readonly nodeDescription: TDescription;
  readonly rawSchema: unknown;
  parentId?: ComponentSchemaId | null;
  components?: Record<ComponentSchemaId, ComponentSchema>;
  customIds?: Record<ComponentSchemaId, ComponentSchemaId>;
  inverted?: boolean;
}

export function normalizeNode<T extends NodeSchema = NodeSchema>(ctx: NormalizeContext<NodeDescription>): T {
  const schema = ctx.rawSchema;
  if (typeof schema === 'string') {
    if (schema.startsWith('=')) {
      return {
        resolverName: 'formula',
        resolverData: schema.slice(1),
      } as T;
    } else if (schema.startsWith('!=')) {
      return {
        resolverName: 'formula',
        resolverData: schema.slice(2),
        inverted: true,
      } as T;
    }
  }

  if (schema && (schema as NodeSchema).resolverName) {
    return schema as T;
  }

  const impl = registry[ctx.nodeDescription.type];
  return impl(ctx) as T;
}
