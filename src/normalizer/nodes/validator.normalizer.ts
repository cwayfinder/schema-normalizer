import { ChildNodeDescription, NodeDescription, ValidatorNodeDescription } from '../../types/node-decription';
import { NormalizeContext, normalizeNode } from '../node.normalizer';

import { NodeSchema, ValidatorNodeRawSchema, ValidatorNodeSchema, ValidatorSchema } from '../../types/schema';
import { validatorPropertiesDescriptions } from '../../types/validators';

export function normalizeValidator(ctx: NormalizeContext<ValidatorNodeDescription>, queue: NormalizeContext<NodeDescription>[]): ValidatorNodeSchema {
  if (!ctx.rawSchema || typeof ctx.rawSchema !== 'object') {
    throw new Error(`Validator node schema "${JSON.stringify(ctx.rawSchema)}" is invalid. It must be an object.`);
  }

  const rawSchema = ctx.rawSchema as ValidatorNodeRawSchema;
  if (!rawSchema.validatorType) {
    throw new Error(
      `Validator node schema "${JSON.stringify(rawSchema)}" is invalid. It must contain field "validatorType".`,
    );
  }

  const props = normalizeChildNodes(ctx, validatorPropertiesDescriptions, rawSchema, queue);

  const paramsDescriptions = ctx.store.getValidatorDefinition(rawSchema.validatorType).description.params;
  const params = normalizeChildNodes(ctx, paramsDescriptions, rawSchema, queue);

  const resolverData = { validatorType: rawSchema.validatorType, ...props, params } as ValidatorSchema;
  return { resolverName: 'static', resolverData, coerced: false };
}

function normalizeChildNodes(
  ctx: NormalizeContext<NodeDescription>,
  descriptions: ChildNodeDescription[],
  rawSchema: Record<string, unknown>,
  queue: NormalizeContext<NodeDescription>[]
): Record<string, NodeSchema> {
  const children: Record<string, NodeSchema> = {};
  for (const description of descriptions) {
    const key = description.key;
    const paramCtx: NormalizeContext<NodeDescription> = {
      ...ctx,
      nodeDescription: description,
      rawSchema: rawSchema[key],
      insert: nodeSchema => children[key] = nodeSchema,
    };
    queue.push(paramCtx);
  }

  return children;
}
